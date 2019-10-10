export class AccountModel {
  public Id: string;
  public Name: string;
  public Currency: string;
  public Status: number;
  public RealizedPNL: number;
  public UnrealizedPNL: number;
  public Balance: number;
  public NetAssetValue: number;
  public UnusedMargin: number;
  public UsedMargin: number;
  public TotalValue: number;
  public RiskProfileId: string;
  public SettlementRealizedPNL: number;
  public SettlementUnrealizedPNL: number;
  public ExchangeAccountId: string;
  public DisplayName: string;
  public InitialMargin?: string;
  public MaintenanceMargin?: string;
}

