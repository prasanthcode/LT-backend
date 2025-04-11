import express from 'express';
import { addAllDistricts,addNewDistrict,deleteAllDistricts,getAllDistricts, getDistrictById,getAllProductsByCategory,getProductById,getAllProductsByCategoryAndDistrict,getNearByProducts} from '../controllers/district.js';
const router= express.Router();

router.post('/addalldistricts',addAllDistricts);
router.post('/addnewdistrict',addNewDistrict);
router.delete('/deletealldistricts',deleteAllDistricts);
router.get('/getalldistricts',getAllDistricts);
router.get('/getdistrictbyid/:id',getDistrictById);
router.get('/getproductsby',getAllProductsByCategory);
router.get('/getproductbyid/:id',getProductById);
router.get('/getallproducts', getAllProductsByCategoryAndDistrict);
router.get('/products/nearby',getNearByProducts);
export default router;