/**
 *
 * @fileoverview This file implements the logic for the pricing endpoints.
 * It is dependent on the pricing route module.
 *
 */

"use strict";

const Prices = require('../models/pricing_model');

exports.get_prices = async (req, res) => {
    let message = "";
    let status = 200;
    let errors = [];

    let now = new Date();
    let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    midnight.setUTCHours(0, 0, 0, 0);

    // Instantiate date as midnight 'yesterday' so we don't get Unix epoch
    let midnight_tomorrow = new Date(midnight.getTime());

    // Update time with 1 day delta
    midnight_tomorrow.setDate(midnight_tomorrow.getDate() + 1);

    let prices;
    try {
        prices = await Prices.find({
            // Find prices generated within the current day's time frame
            createdOn: {
                $gte: midnight,
                $lte: midnight_tomorrow
            },
            // There should never be time slots outside this range but why not
            time_slot: {
                $gte: 0,
                $lte: 3
            }
        });

        if (!prices) {
            message = "Prices have not been generated yet.";
            status = 500;
        } else {
            message = "Prices retrieved successfully.";
        }

    } catch (err) {
        message = `There was an error while retrieving prices.\nError: ${err.name}`;
        status = 500;
        errors.append(err);

    } finally {
        res.status(status).json({
            success: !!prices && !!prices.length,
            errors: errors,
            message: message,
            prices: prices,
        });
    }
};

// exports.add_price = (req, res) => {
//     let message, price;
//     let status = 200;
//     let id = req.user_id;
//     let errors = [];
//
//     // For some reason this has to be initialized earlier to work.
//     price = new Prices({
//         time_slot: req.body.time_slot,
//         cpus: req.body.cpus,
//         gpus: req.body.gpus,
//         memory: req.body.memory,
//         disk_space: req.body.price,
//         created_by: id,
//         updated_by: id,
//     });
//
//     price.save((err, new_price_field) => {
//         if(err) {
//             if (err.code === 11000) {
//                 message = `There was an error while adding the price field.\nError: ${err.name}`;
//             } else {
//                 message = "There was an error while adding the price field.";
//             }
//             status = 500;
//             errors.append(err);
//         } else {
//             message = "Price field added successfully.";
//         }
//         res.status(status).json({
//             success: !err,
//             errors: errors,
//             message: message,
//             data: new_price_field ? new_price_field : null,
//         });
//     });
// };

exports.add_price = async (req, res) => {
    let message, price, new_price;
    let status = 200;
    let id = req.user_id;
    let errors = [];

    price = new Prices({
        time_slot: req.body.time_slot,
        cpus: req.body.cpus,
        gpus: req.body.gpus,
        memory: req.body.memory,
        disk_space: req.body.price,
        created_by: id,
        updated_by: id,
    });

    try {
        new_price = await price.save();

        message = "Price field added successfully.";

    } catch (err) {
        if (err.code === 11000) {
            status = 409;
            message = `There was an error while adding the price field.\nError: ${err.name}`;
        } else {
            message = "There was an error while adding the price field.";
            status = 500;
        }

        errors.append(err);

    } finally {
        res.status(status).json({
            success: !err,
            errors: errors,
            message: message,
            data: new_price ? new_price : null,
        });
    }
};

exports.update_price = (req, res) => {
    res.status(405).json({
        success: true,
        errors: [],
        message: "Updating prices is not supported.",
    });
};

exports.delete_price = (req, res) => {
    res.status(405).json({
        success: true,
        errors: [],
        message: "Deleting prices is not supported.",
    });
};
