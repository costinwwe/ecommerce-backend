import mongoose from 'mongoose';

const footerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  contact: {
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true }
    }
  },
  socialMedia: {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    youtube: { type: String, trim: true }
  },
  businessHours: {
    monday: { type: String, trim: true },
    tuesday: { type: String, trim: true },
    wednesday: { type: String, trim: true },
    thursday: { type: String, trim: true },
    friday: { type: String, trim: true },
    saturday: { type: String, trim: true },
    sunday: { type: String, trim: true }
  },
  quickLinks: [{
    title: { type: String, trim: true },
    url: { type: String, trim: true }
  }],
  copyright: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Only allow one footer document
footerSchema.statics.getFooter = async function() {
  let footer = await this.findOne();
  if (!footer) {
    footer = await this.create({
      companyName: 'Your Company Name',
      description: 'Your company description',
      contact: {
        email: 'contact@example.com',
        phone: '+1 234 567 8900'
      }
    });
  }
  return footer;
};

const Footer = mongoose.model('Footer', footerSchema);

export default Footer;

