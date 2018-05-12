var Resources = require('../models/resource');

exports.getallresources = function(req, res) {

    Resources.find(function(err, resources) {
        var message = "";
        if (err) {
            message = "Error while retrieving the resources";
            res.status(403).json({ message });
        } else {
            res.json(resources);
        }
    });
};

/* GET ALL RESOURCES BY CUSTOMER_ID OR EMAIL_ID */
exports.getresourcesbycustomerId = function(req, res) {
    var customerId = req.params.customerId;
    Resources.find({ owner: req.params.customerId }, function(err, resources) {
        if (err) {
            message = "Error while retrieving the resources for the provided customer Id";
            res.status(403).json({ message });
        } else {
            res.json(resources);
        }
    });

};

/* ADD NEW RESOURCES UNDER THE USER ACCOUNT */
exports.addresourcebycustomerId = function(req, res) {

    var message;

    //console.log(req.body.ip_address);

    var resource = new Resources({
        ip_address: req.body.ip_address,
        ram: req.body.ram,
        cores: req.body.cores,
        cpus: req.body.cpus,
        gpus: req.body.gpus,
        status: "Online",
        price: req.body.price,
        owner: req.params.customerId,
        createdBy: req.params.customerId,
        updatedBy: req.params.customerId,
        machine_name: req.body.machine_name
    });

    resource.save(function(error) {
        if (error) {
            console.error(error);
            if (error.code == 11000) {
                message = " Adding a resource by Customer id failed! ip_address already exists.";
            } else
                message = "Adding a resource by Customer id failed!";

            res.status(403).json({ 'message': message });

        } else {
            message = "A resource is added successfully";
            res.status(200).json({
                'message': message
            });
        }
    })
};

/* UPDATE RESOURCE DETAILS */
exports.updateresourcebycustomerid = function(req, res) {};

/* DELETE PRODUCT */
exports.deleteresourcebyid = function(req, res) {
    var message;


    Resources.remove({ _id: req.params.resourceId, owner: req.params.customerId }, function(err) {
        if (err) {
            message = "Resource deletion failed!";
            res.status(403).json({ 'message': message });
        } else {
            message = "Resource Deletion successful";
            res.status(200).json({
                'message': message
            });
        }

    });
};