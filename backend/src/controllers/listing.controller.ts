import { NextFunction, Request, Response } from "express";
import Listing from "../models/listing.model";
import { CustomRequest } from "../middlewares/auth.middleware";
import * as listingService from "../services/listing.service";

export const getListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listings = await Listing.find({
      userRef: (req as CustomRequest).user.id
    });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listingId } = req.params;
    const deletedListing = await listingService.deleteListing(listingId);
    res.status(200).json(deletedListing);
  } catch (error) {
    next(error);
  }
};