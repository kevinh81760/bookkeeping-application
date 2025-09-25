import express from "express";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import db from "../db/dynamoClient.js";

const router = express.Router();

