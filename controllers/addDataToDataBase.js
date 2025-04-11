

import productModel from "../models/productModel.js"
import categoryModel from "../models/categoryModel.js"
import stateModel from "../models/stateModel.js"
import countryModel from "../models/countryModel.js"
import districtModel from "../models/districtModel.js"

import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




export const addData=async()=>{


const dataPath = path.join(__dirname, '../helpers/data.json');

let data=fs.readFileSync(dataPath,'utf-8')

let allData=JSON.parse(data);



// console.log(data);






await insertData(allData);

  
}





async function insertData(allData) {
    for (const data of allData) {
      // Insert country
      const country = { name: data.name };
      const countryResult = await countryModel.create(country);
  
      // Insert states
      for (const state of data.states) {
        const stateData = { name: state.name, countryId: countryResult._id };
        const stateResult = await stateModel.create(stateData);
        const stateId = stateResult._id;
  
        // Insert districts
        for (const district of state.districts) {
          const districtData = { name: district.name, stateId: stateId };
          const districtResult = await districtModel.create(districtData);
          const districtId = districtResult._id;
  
          // Insert categories
          if (Array.isArray(district.categories)) {
            for (const category of district.categories) {
              const categoryData = { name: category.name, districtId: districtId };
              const categoryResult = await categoryModel.create(categoryData);
              const categoryId = categoryResult._id;
              console.log("categoryId",categoryId)
  
              // Insert products
              if (Array.isArray(category.products)) {
                for (const product of category.products) {
                  const productData = {
                    name: product.name,
                    desc: product.desc,
                    cost: product.cost,
                    url: product.url,
                    quantity: product.quantity,
                    categoryId: categoryId,
                    sellers: product.sellers,
                    location: product.location,
                    address: product.address
                  };
                  await productModel.create(productData);
                }
              } else {
                console.warn(`Products is not an array for category: ${category.name}`);
              }
            }
          } else {
            console.warn(`Categories is not an array for district: ${district.name}`);
            // console.log(district.categories)
          }
        }
      }
    }
  }