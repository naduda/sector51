package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.*;
import pr.sector51.server.persistence.model.Barcode;
import pr.sector51.server.persistence.model.Product;

import java.util.List;

public interface IScannerMapper {
  @Select("SELECT * FROM barcode WHERE code = #{code};")
  Barcode getBarcodeByCode(@Param("code") String value);

  @Select("SELECT * FROM barcode WHERE productid = #{id};")
  Barcode getBarcodeByProductId(@Param("id") int id);

  @Select("SELECT p.*, b.code FROM product as p LEFT JOIN barcode as b ON p.id = b.productid ORDER BY id;")
  List<Product> getAllProducts();

  @Insert("INSERT INTO product(id, name, \"desc\", count, price) VALUES(" +
      "      (SELECT max(id) + 1 FROM product), #{value.name}, #{value.desc}, #{value.count}, #{value.price});\n" +
      "INSERT INTO barcode(productid, code) VALUES((SELECT max(id) FROM product), #{code});")
  int insertProduct(@Param("value") Product value, @Param("code") String code);

  @Insert("INSERT INTO product(id, name, \"desc\", count, price) VALUES(" +
      "     (SELECT max(id) + 1 FROM product product WHERE id < 100), " +
      "     #{value.name}, #{value.desc}, #{value.count}, #{value.price});\n" +
      "INSERT INTO barcode(productid, code) VALUES(" +
      "     (SELECT max(id) FROM product WHERE id < 100), (SELECT FLOOR(extract(epoch from now()) * 1000) as text));")
  int insertProductDefault(@Param("value") Product value);

  @Select("SELECT * FROM product WHERE id > 100 ORDER BY id DESC LIMIT 1;")
  Product getLastProduct();

  @Delete("DELETE FROM product WHERE id = #{id}; DELETE FROM barcode WHERE productid = #{id};")
  int removeProduct(int id);

  @Insert("INSERT INTO barcode(productId, code) VALUES(#{productId}, #{code});")
  void insertBarcode(@Param("productId") int productId, @Param("code") String code);

  @Update("UPDATE product set name = #{value.name}, \"desc\" = #{value.desc}, " +
      "count = #{value.count}, price = #{value.price} WHERE id = #{value.id};")
  int updateProduct(@Param("value") Product product);

  @Update("UPDATE barcode set code = #{barcode.code} WHERE productid = #{barcode.productId}")
  int updateBarcode(@Param("barcode") Barcode barcode);

  @Select("SELECT * FROM product WHERE id = #{id}")
  Product getPrpoductById(@Param("id") int prodId);
}
