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
import { Property } from "./Property";

@Table({
  tableName: "property_images",
  timestamps: true,
})
export class PropertyImage extends Model<PropertyImage> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Property)
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyId!: number;

  @BelongsTo(() => Property, "propertyId")
  property?: Property;

  @Column({ type: DataType.STRING, allowNull: false })
  filename!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  url!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isMain!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  ordering?: number | null;
}

export default PropertyImage;