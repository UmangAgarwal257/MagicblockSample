import { PublicKey } from "@solana/web3.js";
import { Position } from "../target/types/position";
import { Movement } from "../target/types/movement";
import { Velocity } from "../target/types/velocity";
import { ApplyVelocity } from "../target/types/apply_velocity";
import {
    InitializeNewWorld,
    AddEntity,
    InitializeComponent,
    ApplySystem,
    Program
} from "@magicblock-labs/bolt-sdk"
import { expect } from "chai";
import * as anchor from "@coral-xyz/anchor";

describe("Bolt ECS Game Tests", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Constants used to test the program.
  let worldPda: PublicKey;
  let entityPda: PublicKey;
  let positionComponentPda: PublicKey;
  let velocityComponentPda: PublicKey;

  const positionComponent = anchor.workspace.Position as Program<Position>;
  const velocityComponent = anchor.workspace.Velocity as Program<Velocity>;
  const movementSystem = anchor.workspace.Movement as Program<Movement>;
  const applyVelocitySystem = anchor.workspace.ApplyVelocity as Program<ApplyVelocity>;

  it("Should initialize a new world", async () => {
    const initNewWorld = await InitializeNewWorld({
      payer: provider.wallet.publicKey,
      connection: provider.connection,
    });
    const txSign = await provider.sendAndConfirm(initNewWorld.transaction);
    worldPda = initNewWorld.worldPda;
    console.log(`Initialized a new world (ID=${worldPda}). Signature: ${txSign}`);
    expect(worldPda).to.not.be.undefined;
  });

  it("Should add an entity to the world", async () => {
    const addEntity = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    });
    const txSign = await provider.sendAndConfirm(addEntity.transaction);
    entityPda = addEntity.entityPda;
    console.log(`Added entity (PDA=${addEntity.entityPda}). Signature: ${txSign}`);
    expect(entityPda).to.not.be.undefined;
  });

  it("Should initialize position component", async () => {
    const initializeComponent = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: entityPda,
      componentId: positionComponent.programId,
    });
    const txSign = await provider.sendAndConfirm(initializeComponent.transaction);
    positionComponentPda = initializeComponent.componentPda;
    console.log(`Initialized position component. Signature: ${txSign}`);
    expect(positionComponentPda).to.not.be.undefined;
  });

  it("Should initialize velocity component", async () => {
    const initializeComponent = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: entityPda,
      componentId: velocityComponent.programId,
    });
    const txSign = await provider.sendAndConfirm(initializeComponent.transaction);
    velocityComponentPda = initializeComponent.componentPda;
    console.log(`Initialized velocity component. Signature: ${txSign}`);
    expect(velocityComponentPda).to.not.be.undefined;
  });

  it("Should verify initial position values", async () => {
    const positionBefore = await positionComponent.account.position.fetch(
      positionComponentPda
    );
    expect(positionBefore.x.toNumber()).to.equal(0);
    expect(positionBefore.y.toNumber()).to.equal(0);
    expect(positionBefore.z.toNumber()).to.equal(0);
    console.log(`Initial position: x=${positionBefore.x}, y=${positionBefore.y}, z=${positionBefore.z}`);
  });

  it("Should verify initial velocity values", async () => {
    const velocityBefore = await velocityComponent.account.velocity.fetch(
      velocityComponentPda
    );
    expect(velocityBefore.vx.toNumber()).to.equal(0);
    expect(velocityBefore.vy.toNumber()).to.equal(0);
    console.log(`Initial velocity: vx=${velocityBefore.vx}, vy=${velocityBefore.vy}`);
  });

  it("Should apply movement system and update position", async () => {
    // Apply the movement system
    const applySystem = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: movementSystem.programId,
      world: worldPda,
      entities: [{
        entity: entityPda,
        components: [{ componentId: positionComponent.programId }],
      }]
    });
    const txSign = await provider.sendAndConfirm(applySystem.transaction);
    console.log(`Applied movement system. Signature: ${txSign}`);

    // Verify the position has been updated
    const positionAfter = await positionComponent.account.position.fetch(
      positionComponentPda
    );
    expect(positionAfter.x.toNumber()).to.equal(1);
    expect(positionAfter.y.toNumber()).to.equal(1);
    console.log(`Updated position: x=${positionAfter.x}, y=${positionAfter.y}, z=${positionAfter.z}`);
  });

  it("Should apply movement system multiple times", async () => {
    // Apply the system again
    const applySystem = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: movementSystem.programId,
      world: worldPda,
      entities: [{
        entity: entityPda,
        components: [{ componentId: positionComponent.programId }],
      }]
    });
    await provider.sendAndConfirm(applySystem.transaction);

    // Verify the position has been updated again
    const positionAfter = await positionComponent.account.position.fetch(
      positionComponentPda
    );
    expect(positionAfter.x.toNumber()).to.equal(2);
    expect(positionAfter.y.toNumber()).to.equal(2);
    console.log(`Position after second movement: x=${positionAfter.x}, y=${positionAfter.y}`);
  });

  it("Should test apply-velocity system with both position and velocity components", async () => {
    // Apply the apply-velocity system which should add velocity to position
    const applySystem = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: applyVelocitySystem.programId,
      world: worldPda,
      entities: [{
        entity: entityPda,
        components: [
          { componentId: positionComponent.programId },
          { componentId: velocityComponent.programId }
        ],
      }]
    });
    const txSign = await provider.sendAndConfirm(applySystem.transaction);
    console.log(`Applied velocity system. Signature: ${txSign}`);

    // Since velocity is 0, position should remain the same
    const positionAfter = await positionComponent.account.position.fetch(
      positionComponentPda
    );
    expect(positionAfter.x.toNumber()).to.equal(2); // Same as before since velocity is 0
    expect(positionAfter.y.toNumber()).to.equal(2);
    console.log(`Position after applying zero velocity: x=${positionAfter.x}, y=${positionAfter.y}`);
  });

  it("Should handle multiple entities with different components", async () => {
    // Create a second entity
    const addEntity2 = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    });
    const entity2Pda = addEntity2.entityPda;
    await provider.sendAndConfirm(addEntity2.transaction);
    console.log(`Added second entity (PDA=${entity2Pda})`);

    // Initialize only position component for the second entity (no velocity)
    const initializeComponent2 = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: entity2Pda,
      componentId: positionComponent.programId,
    });
    const position2ComponentPda = initializeComponent2.componentPda;
    await provider.sendAndConfirm(initializeComponent2.transaction);

    // Apply movement system to the second entity
    const applySystem = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: movementSystem.programId,
      world: worldPda,
      entities: [{
        entity: entity2Pda,
        components: [{ componentId: positionComponent.programId }],
      }]
    });
    await provider.sendAndConfirm(applySystem.transaction);

    // Verify the second entity's position
    const position2After = await positionComponent.account.position.fetch(
      position2ComponentPda
    );
    expect(position2After.x.toNumber()).to.equal(1);
    expect(position2After.y.toNumber()).to.equal(1);
    console.log(`Second entity position: x=${position2After.x}, y=${position2After.y}`);

    // Verify the first entity's position is unchanged
    const position1After = await positionComponent.account.position.fetch(
      positionComponentPda
    );
    expect(position1After.x.toNumber()).to.equal(2); // Should still be 2 from previous tests
    expect(position1After.y.toNumber()).to.equal(2);
  });

  it("Should verify component isolation between entities", async () => {
    // Apply movement to just the first entity again
    const applySystem = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: movementSystem.programId,
      world: worldPda,
      entities: [{
        entity: entityPda,
        components: [{ componentId: positionComponent.programId }],
      }]
    });
    await provider.sendAndConfirm(applySystem.transaction);

    // Verify first entity moved
    const position1After = await positionComponent.account.position.fetch(
      positionComponentPda
    );
    expect(position1After.x.toNumber()).to.equal(3);
    expect(position1After.y.toNumber()).to.equal(3);
    console.log(`First entity final position: x=${position1After.x}, y=${position1After.y}`);
  });
});
