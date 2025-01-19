import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { IDL } from './idl';

export class SolanaClient {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;

  constructor(
    endpoint: string,
    programId: string,
    wallet: any // Replace with proper wallet type
  ) {
    this.connection = new Connection(endpoint);
    this.provider = new AnchorProvider(
      this.connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    this.program = new Program(IDL, new PublicKey(programId), this.provider);
  }

  async initializeProject(
    title: string,
    description: string,
    tokenSupply: number
  ) {
    try {
      const [projectPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('project'),
          this.provider.wallet.publicKey.toBuffer()
        ],
        this.program.programId
      );

      const tx = await this.program.methods
        .initializeProject(title, description, tokenSupply)
        .accounts({
          project: projectPda,
          creator: this.provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { tx, projectPda };
    } catch (error) {
      console.error('Error initializing project:', error);
      throw error;
    }
  }

  async addCollaborator(
    projectPda: PublicKey,
    collaboratorPubkey: PublicKey,
    role: string,
    allocation: number
  ) {
    try {
      const [collaborationPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('collaboration'),
          projectPda.toBuffer(),
          collaboratorPubkey.toBuffer()
        ],
        this.program.programId
      );

      const tx = await this.program.methods
        .addCollaborator(role, allocation)
        .accounts({
          collaboration: collaborationPda,
          project: projectPda,
          collaborator: collaboratorPubkey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { tx, collaborationPda };
    } catch (error) {
      console.error('Error adding collaborator:', error);
      throw error;
    }
  }

  async createResource(
    title: string,
    description: string,
    resourceType: string,
    exchangeType: string,
    price: number
  ) {
    try {
      const [resourcePda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('resource'),
          this.provider.wallet.publicKey.toBuffer()
        ],
        this.program.programId
      );

      const tx = await this.program.methods
        .createResource(title, description, resourceType, exchangeType, price)
        .accounts({
          resource: resourcePda,
          provider: this.provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { tx, resourcePda };
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }

  async exchangeResource(
    resourcePda: PublicKey,
    providerPubkey: PublicKey,
    amount: number
  ) {
    try {
      const tx = await this.program.methods
        .exchangeResource(amount)
        .accounts({
          resource: resourcePda,
          buyer: this.provider.wallet.publicKey,
          provider: providerPubkey,
          // Add token accounts here
          tokenProgram: web3.TokenProgram.programId,
        })
        .rpc();

      return { tx };
    } catch (error) {
      console.error('Error exchanging resource:', error);
      throw error;
    }
  }
}