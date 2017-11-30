package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import pr.sector51.server.persistence.model.Barcode;
import pr.sector51.server.persistence.model.Product;

import java.util.List;

public interface IScannerMapper {
  @Select("SELECT * FROM barcode where code = #{code};")
  Barcode getBarcodeByCode(@Param("code") String value);

  @Select("SELECT * FROM product;")
  List<Product> getAllProducts();
}
