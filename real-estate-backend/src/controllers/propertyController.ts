import { Request, Response } from "express";
import Property from "../models/Property";
import PropertyImage from "../models/PropertyImage";

export const createProperty = async (req: Request, res: Response) => {
  try {
    // Eğer multipart/form-data ile geliyorsa form veri req.body içinde ve dosyalar req.files içinde olur.
    const body = req.body;
    if (!body.listingCode) return res.status(400).json({ error: "listingCode gerekli" });

    // attributes eğer JSON string olarak geldiyse parse et
    let attributes = body.attributes;
    try {
      if (typeof attributes === "string") attributes = JSON.parse(attributes);
    } catch (e) {
      // ignore parse error, backend tarafında attributes objesi bekleniyor
    }

    const newProp = await Property.create({
      listingCode: body.listingCode,
      branchId: body.branchId,
      category: body.category,
      city: body.city,
      province: body.province,
      district: body.district,
      neighborhood: body.neighborhood,
      address: body.address,
      location: body.location ? JSON.parse(body.location) : body.location,
      saleType: body.saleType,
      propertyType: body.propertyType,
      subType: body.subType,
      price: body.price,
      rentPrice: body.rentPrice,
      attributes: attributes,
      createdBy: req.user?.id || body.createdBy || null,
    });

    // Dosya yüklemeleri varsa req.files'dan işleyelim
    // Beklenen multer konfigürasyonu: fields([{name:'mainPhoto',maxCount:1},{name:'detailPhotos',maxCount:10}])
    const filesAny: any = req.files || {};
    const mainFile = filesAny.mainPhoto ? filesAny.mainPhoto[0] : null;
    const detailFiles = filesAny.detailPhotos || [];

    const createdImages: any[] = [];

    if (mainFile) {
      const url = `/uploads/properties/${mainFile.filename}`; // sunucunuzda dosya erişim url'si
      const img = await PropertyImage.create({
        propertyId: newProp.id,
        filename: mainFile.filename,
        url,
        isMain: true,
      });
      createdImages.push(img);
    }

    if (detailFiles.length) {
      for (let i = 0; i < detailFiles.length && i < 10; i++) {
        const f = detailFiles[i];
        const url = `/uploads/properties/${f.filename}`;
        const img = await PropertyImage.create({
          propertyId: newProp.id,
          filename: f.filename,
          url,
          isMain: false,
          ordering: i,
        });
        createdImages.push(img);
      }
    }

    // İsteğe bağlı: response içinde property + images dön
    const responseObj = {
      ...newProp.toJSON(),
      images: createdImages,
    };

    return res.status(201).json(responseObj);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};