/**
 * Smart Contract Auditor
 * Specialized auditing for smart contract operations
 */
import { SecurityAuditor, AuditEventType, AuditSeverity } from './audit';
import { errorTracker } from '../lib/monitoring';

export class ContractAuditor {
  private securityAuditor: SecurityAuditor;
  private riskPatterns: Map<string, RegExp>;
  private vulnerabilityChecks: Map<string, (data: any) => boolean>;

  constructor(securityAuditor: SecurityAuditor) {
    this.securityAuditor = securityAuditor;
    this.riskPatterns = new Map();
    this.vulnerabilityChecks = new Map();
    this.initializeChecks();
  }

  private initializeChecks() {
    // Initialize risk patterns
    this.riskPatterns.set(
      'reentrancy',
      /call.*transfer.*call/i
    );
    this.riskPatterns.set(
      'integerOverflow',
      /\+\+|\+=|[+](?=\d)/
    );
    this.riskPatterns.set(
      'unauthorizedAccess',
      /owner|admin|authority/i
    );

    // Initialize vulnerability checks
    this.vulnerabilityChecks.set(
      'tokenApproval',
      (data: any) => {
        return data.amount === Number.MAX_SAFE_INTEGER;
      }
    );
    
    this.vulnerabilityChecks.set(
      'zeroAddress',
      (data: any) => {
        return data.address === '0x0000000000000000000000000000000000000000';
      }
    );
    
    this.vulnerabilityChecks.set(
      'selfDestruct',
      (data: any) => {
        return data.instruction?.includes('close') || 
               data.instruction?.includes('selfdestruct');
      }
    );
  }

  // Audit contract deployment
  async auditDeployment(
    contractId: string,
    code: string,
    deployer: string
  ): Promise<void> {
    // Check for known vulnerabilities in code
    const vulnerabilities = this.checkVulnerabilities(code);
    
    if (vulnerabilities.length > 0) {
      await this.securityAuditor.auditContractCall(
        contractId,
        'deploy',
        [deployer],
        {
          vulnerabilities,
          severity: AuditSeverity.CRITICAL
        }
      );

      errorTracker.track(
        new Error('Contract deployment vulnerabilities detected'),
        { vulnerabilities }
      );
    }
  }

  // Audit contract upgrade
  async auditUpgrade(
    contractId: string,
    oldVersion: string,
    newVersion: string,
    upgrader: string
  ): Promise<void> {
    // Check for breaking changes
    const breakingChanges = this.checkBreakingChanges(oldVersion, newVersion);
    
    if (breakingChanges.length > 0) {
      await this.securityAuditor.auditContractCall(
        contractId,
        'upgrade',
        [upgrader],
        {
          breakingChanges,
          severity: AuditSeverity.HIGH
        }
      );

      errorTracker.track(
        new Error('Contract upgrade breaking changes detected'),
        { breakingChanges }
      );
    }
  }

  // Check for vulnerabilities in contract code
  private checkVulnerabilities(code: string): string[] {
    const vulnerabilities: string[] = [];

    // Check risk patterns
    for (const [name, pattern] of this.riskPatterns) {
      if (pattern.test(code)) {
        vulnerabilities.push(`Risk pattern detected: ${name}`);
      }
    }

    // Static analysis checks
    if (code.includes('assembly')) {
      vulnerabilities.push('Inline assembly usage detected');
    }

    if (code.includes('delegatecall')) {
      vulnerabilities.push('Delegatecall usage detected');
    }

    return vulnerabilities;
  }

  // Check for breaking changes between versions
  private checkBreakingChanges(
    oldVersion: string,
    newVersion: string
  ): string[] {
    const breakingChanges: string[] = [];

    // Compare function signatures
    const oldFunctions = this.extractFunctions(oldVersion);
    const newFunctions = this.extractFunctions(newVersion);

    // Check for removed functions
    oldFunctions.forEach(func => {
      if (!newFunctions.includes(func)) {
        breakingChanges.push(`Removed function: ${func}`);
      }
    });

    // Check for modified function signatures
    newFunctions.forEach(func => {
      const oldFunc = oldFunctions.find(f => 
        f.split('(')[0] === func.split('(')[0]
      );
      if (oldFunc && oldFunc !== func) {
        breakingChanges.push(`Modified function signature: ${func}`);
      }
    });

    return breakingChanges;
  }

  // Extract function signatures from code
  private extractFunctions(code: string): string[] {
    const functionRegex = /fn\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)/g;
    const matches = code.match(functionRegex) || [];
    return matches.map(match => match.trim());
  }

  // Check specific vulnerability
  async checkVulnerability(
    name: string,
    data: any
  ): Promise<boolean> {
    const check = this.vulnerabilityChecks.get(name);
    if (!check) {
      throw new Error(`Unknown vulnerability check: ${name}`);
    }
    return check(data);
  }
}