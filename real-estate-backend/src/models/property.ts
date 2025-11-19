import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  import { User } from "./User";
  
  @Table({
    tableName: "properties",
    timestamps: true,
  })
  export class Property extends Model<Property> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column({ type: DataType.STRING, unique: true })
    listingCode!: string;
  
    @Column({ type: DataType.INTEGER, allowNull: true })
    branchId?: number;
  
    @Column({ type: DataType.STRING, allowNull: true })
    category?: string;
  
    @Column({ type: DataType.STRING, allowNull: true })
    city?: string;
  
    @Column({ type: DataType.STRING, allowNull: true })
    province?: string;
  
    @Column({ type: DataType.STRING, allowNull: true })
    district?: string;
  
    @Column({ type: DataType.STRING, allowNull: true })
    neighborhood?: string;
  
    @Column({ type: DataType.TEXT, allowNull: true })
    address?: string;
  
    @Column({ type: DataType.JSON, allowNull: true })
    location?: { lat?: number; lng?: number };
  
    @Column({ type: DataType.ENUM("satilik", "kiralik"), allowNull: false, defaultValue: "satilik" })
    saleType!: "satilik" | "kiralik";
  
    @Column({
      type: DataType.ENUM("konut", "arsa", "ticari", "devren", "tarla", "bahce", "hobi_bahcesi"),
      allowNull: false,
      defaultValue: "konut",
    })
    propertyType!: string;
  
    @Column({ type: DataType.STRING, allowNull: true })
    subType?: string;
  
    @Column({ type: DataType.DECIMAL(18,2), allowNull: true })
    price?: number;
  
    @Column({ type: DataType.DECIMAL(18,2), allowNull: true })
    rentPrice?: number;
  
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    createdBy?: number;
  
    @BelongsTo(() => User)
    creator?: User;
  
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    isActive!: boolean;
  
    @Column({ type: DataType.JSON, allowNull: true })
    attributes?: Record<string, any>;
  }
  export default Property;