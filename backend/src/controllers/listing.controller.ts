import { NextFunction, Request, Response } from "express";
import Listing, { ListingDocument } from "../models/listing.model";
import { CustomRequest } from "../middlewares/auth.middleware";
import * as listingService from "../services/listing.service";
import { UserDocument } from "../models/user.model";

export const getListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listings = await Listing.find()
      .populate<{ user: UserDocument }>("userRef")
      .orFail();

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await listingService.getListing(req.params.listingId);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (
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
    await listing.populate<{ owner: UserDocument }>("userRef");
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

export const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listingId } = req.params;
    const userId = (req as CustomRequest).user.id;
    const udpatedListing = await listingService.updateListing(
      listingId,
      userId,
      req.body
    );
    res.status(200).json(udpatedListing);
  } catch (error) {
    next(error);
  }
};
