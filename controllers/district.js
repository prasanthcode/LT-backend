import districts from '../models/district.js';
export const addAllDistricts=async( req,res)=>{
    const data=req.body;
    try{
        const totalData=await districts.insertMany(data);
        res.status(201).json(totalData);
    }
    catch(err){
        res.status(400).json("Data Not Added");
    }
}

export const deleteAllDistricts=async(req,res)=>{
    try{
        await districts.deleteMany({})
        res.status(201).json("Deleted");
    }
    catch(err){
        res.status(400).json("Data not deleted");
    }
}
export const addNewDistrict=async(req,res)=>{
    const data=req.body;
    try{
        const reponse=await districts.find()
        const updated=[...reponse, ...data];
        await districts.deleteMany({})
        await districts.insertMany(updated);
        res.status(201),json("data is updated");
    }
    catch(err){
        res.status(400).json(err);
    }
}
export const getAllDistricts=async(req,res)=>{
    try{
        const data=await districts.find()
        res.status(201).json(data);
    }
    catch(err){
        res.status(400).json(err);
    }
}

export const getDistrictById = async (req, res) => {
    const districtId = req.params.id;
    try {
        const district = await districts.findById(districtId);

        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }
        res.status(200).json(district);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllProductsByCategory = async (req, res) => {
  const { category } = req.query;

  try {
    const totalData = await districts.find();
    let products = [];

    totalData.forEach(dist => {
      if (dist.products[category]) {
        dist.products[category].forEach(item => {
          products.push(item);
        });
      }
    });

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found for category: ${category}` });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: "Failed to get products data", error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allDistricts = await districts.find();
    let allProducts = [];

    allDistricts.forEach(district => {
      Object.keys(district.products).forEach(category => {
        district.products[category].forEach(product => {
          allProducts.push(product);
        });
      });
    });

    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const allDistricts = await districts.find();
        let foundProduct = null;

        // Aggregate all products
        allDistricts.forEach(district => {
            Object.keys(district.products).forEach(category => {
                district.products[category].forEach(product => {
                    if (product._id.toString() === productId) {
                        foundProduct = product;
                    }
                });
            });
        });

        if (!foundProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(foundProduct);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const getAllProductsByCategoryAndDistrict = async (req, res) => {
  const { category, district } = req.query;
  try {
    let query = {};

    
    if (category) {
      query[`products.${category}`] = { $exists: true };
    }
    if (district) {
      query.name = district;
    }

    
    if (!category && !district) {
      query = {};
    }

    const products = await districts.find(query).select('products');

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found matching the criteria' });
    }

    let filteredProducts = [];

    
    if (category) {
      products.forEach(dist => {
        if (dist.products[category]) {
          filteredProducts = [...filteredProducts, ...dist.products[category]];
        }
      });
    } else {
      
      products.forEach(dist => {
        Object.values(dist.products).forEach(productArray => {
          filteredProducts = [...filteredProducts, ...productArray];
        });
      });
    }

    res.status(200).json(filteredProducts);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const getNearByProducts = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const allDistricts = await districts.find();
    let allProducts = [];

    
    allDistricts.forEach(district => {
      Object.values(district.products).forEach(categoryProducts => {
        allProducts = allProducts.concat(categoryProducts);
      });
    });

    // Parsing latitude and longitude to numbers
    const latitudeNum = parseFloat(latitude);
    const longitudeNum = parseFloat(longitude);

    // Filtering out products without location data
    const validProducts = allProducts.filter(product => product.location && product.location.lat && product.location.long);

    // Sorting products based on distance to the provided coordinates
    validProducts.sort((a, b) => {
      const distA = Math.sqrt((a.location.lat - latitudeNum) ** 2 + (a.location.long - longitudeNum) ** 2);
      const distB = Math.sqrt((b.location.lat - latitudeNum) ** 2 + (b.location.long - longitudeNum) ** 2);
      return distA - distB;
    });

    // Returning the nearest two products
    res.json(validProducts.slice(0, 2));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby products', error });
  }
};