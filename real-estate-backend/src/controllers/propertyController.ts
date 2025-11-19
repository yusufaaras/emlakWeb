import { Request, Response } from "express";
import Property from "../models/Property";

export const createProperty = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.listingCode) return res.status(400).json({ error: "listingCode gerekli" });

    const newProp = await Property.create({
      listingCode: body.listingCode,
      branchId: body.branchId,
      category: body.category,
      city: body.city,
      province: body.province,
      district: body.district,
      neighborhood: body.neighborhood,
      address: body.address,
      location: body.location,
      saleType: body.saleType,
      propertyType: body.propertyType,
      subType: body.subType,
      price: body.price,
      rentPrice: body.rentPrice,
      attributes: body.attributes,
      createdBy: req.user?.id || body.createdBy || null,
    });

    return res.status(201).json(newProp);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const listProperties = async (_req: Request, res: Response) => {
  try {
    const properties = await Property.findAll({ limit: 100 });
    return res.json(properties);
  } catch (err) {
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};
export default { createProperty, listProperties };