import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProductHeader from "../components/productsPage/ProductHeader";
import ProductTable from "../components/productsPage/ProductTable";

import {
  deleteProduct,
  getProductById,
  getProducts,
} from "../services/product.service";

import { deleteProductImagesFromR2 } from "../services/productImage.service";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingProductId, setDeletingProductId] = useState(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (err) {
      console.error("Ürünler yüklenirken hata oluştu:", err);

      setError("Ürünler yüklenirken bir hata oluştu.");

      toast.error("Ürünler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!id) {
      return;
    }

    if (deletingProductId) {
      return;
    }

    try {
      setDeletingProductId(id);

      /*
       * Ürünü silmeden önce görsellerini alıyoruz.
       *
       * Çünkü product silindikten sonra
       * product_images kayıtları cascade ile
       * silinirse object_key bilgilerini artık
       * okuyamayız.
       */
      const product = await getProductById(id);

      const objectKeys = (product.images || [])
        .map((image) => image.objectKey)
        .filter(Boolean);

      /*
       * Önce fiziksel R2 dosyalarını siliyoruz.
       */
      if (objectKeys.length > 0) {
        await deleteProductImagesFromR2({
          productId: id,
          objectKeys,
        });
      }

      /*
       * Ardından ürünü database'den siliyoruz.
       *
       * product_images FK cascade ise görsel
       * kayıtları da burada temizlenecek.
       */
      await deleteProduct(id);

      setProducts((prev) => prev.filter((item) => item.id !== id));

      toast.success("Ürün başarıyla silindi.");
    } catch (err) {
      console.error("Ürün silinirken hata oluştu:", err);

      if (err?.message === "R2_DELETE_FAILED") {
        toast.error(
          "Ürün görselleri R2 üzerinden silinemedi. Ürün silme işlemi durduruldu.",
        );

        return;
      }

      toast.error("Ürün silinirken bir hata oluştu.");
    } finally {
      setDeletingProductId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ProductHeader />

        <div className="alert alert-error">
          <span>{error}</span>

          <button type="button" className="btn btn-sm" onClick={loadProducts}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductHeader />

      <ProductTable
        products={products}
        onDelete={handleDeleteProduct}
        deletingProductId={deletingProductId}
      />
    </div>
  );
};

export default ProductsPage;
