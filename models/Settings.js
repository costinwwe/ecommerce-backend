import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  brand: {
    logo: String,
    name: String,
    favicon: String
  },
  theme: {
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#64748b' }
  },
  shipping: {
    freeShippingThreshold: { type: Number, default: 0 },
    defaultShippingCost: { type: Number, default: 0 },
    shippingRules: [{
      name: String,
      cost: Number,
      minOrder: Number,
      maxOrder: Number,
      countries: [String]
    }]
  },
  tax: {
    enabled: { type: Boolean, default: false },
    rate: { type: Number, default: 0 },
    includeInPrice: { type: Boolean, default: false },
    taxRules: [{
      country: String,
      state: String,
      rate: Number
    }]
  },
  payment: {
    stripe: {
      publicKey: String,
      secretKey: String,
      enabled: { type: Boolean, default: false }
    },
    paypal: {
      clientId: String,
      secret: String,
      enabled: { type: Boolean, default: false }
    }
  },
  email: {
    fromEmail: String,
    fromName: String,
    smtp: {
      host: String,
      port: Number,
      secure: Boolean,
      user: String,
      password: String
    }
  },
  seo: {
    siteTitle: String,
    siteDescription: String,
    keywords: [String],
    googleAnalytics: String,
    facebookPixel: String
  },
  social: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  maintenance: {
    enabled: { type: Boolean, default: false },
    message: String
  }
}, {
  timestamps: true
});

// Only one settings document
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;

