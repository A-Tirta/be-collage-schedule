import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "order",
  timestamps: true,
})
export class Order extends Model {
  @Column({
    type: DataType.INTEGER,
    references: {
      model: "users", // Assuming you have a users table
      key: "id",
    },
    allowNull: false,
  })
  user_id!: number;

  @Column({
    type: DataType.INTEGER,
    references: {
      model: "products", // Assuming you have a products table
      key: "id",
    },
    allowNull: false,
  })
  product_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  price_per_unit!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  product_name!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  line_total!: number;

  static associate(models: any) {
    Order.belongsTo(models.User, { foreignKey: "user_id" });
    Order.belongsTo(models.Product, { foreignKey: "product_id" });
  }
}
