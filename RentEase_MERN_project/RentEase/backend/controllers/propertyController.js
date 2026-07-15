const Property = require('../models/Property');

// @desc    Get all properties (with optional filter)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { location, bedrooms, maxPrice, availability } = req.query;
    let query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }
    if (availability !== undefined) {
      query.availability = availability === 'true';
    }

    const properties = await Property.find(query).populate('addedBy', 'name email');
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('addedBy', 'name email phone');
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = async (req, res) => {
  try {
    const { title, description, location, price, bedrooms, availability } = req.body;

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        imageUrls.push(`/uploads/${file.filename}`);
      });
    }

    const property = new Property({
      title,
      description,
      location,
      price: Number(price),
      bedrooms: Number(bedrooms),
      availability: availability === 'true' || availability === true,
      images: imageUrls,
      addedBy: req.user._id,
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res) => {
  try {
    const { title, description, location, price, bedrooms, availability, existingImages } = req.body;
    const property = await Property.findById(req.params.id);

    if (property) {
      property.title = title || property.title;
      property.description = description || property.description;
      property.location = location || property.location;
      property.price = price !== undefined ? Number(price) : property.price;
      property.bedrooms = bedrooms !== undefined ? Number(bedrooms) : property.bedrooms;
      property.availability = availability !== undefined ? (availability === 'true' || availability === true) : property.availability;

      let imageUrls = [];
      
      // Parse or add existing images if provided
      if (existingImages) {
        if (Array.isArray(existingImages)) {
          imageUrls = [...existingImages];
        } else {
          // If it is sent as a JSON string, try to parse it
          try {
            const parsed = JSON.parse(existingImages);
            if (Array.isArray(parsed)) {
              imageUrls = [...parsed];
            } else {
              imageUrls.push(parsed);
            }
          } catch (e) {
            imageUrls.push(existingImages);
          }
        }
      }

      // Add new files
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          imageUrls.push(`/uploads/${file.filename}`);
        });
      }

      // Only update images if we have any inputs (existing or new)
      if (existingImages !== undefined || (req.files && req.files.length > 0)) {
        property.images = imageUrls;
      }

      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      await Property.deleteOne({ _id: req.params.id });
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
