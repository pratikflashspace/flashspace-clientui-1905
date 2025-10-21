import { API } from "@/api";
import axios from "axios";
// import { Contact, ContactFormData } from "@/types/services";

/**
 * Create a new contact form
 * @param contactForm - Contact form data to create
 * @returns Created contact form data
 */
export const createContactForm = async (contactForm: any) => {
  try {
    const response: any = await axios.post(
      `${API.domain}${API.endPoints.createForm}`,
      contactForm
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to create contact form");
    }

    throw new Error("Failed to create contact form");
  } catch (error: any) {
    console.error("Error creating contact form:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create contact form");
    }
  }
};

/**
 * Get all contact forms
 * @returns Array of all contact forms
 */
export const getAllContactForms = async () => {
  try {
    const response: any = await axios.get(
      `${API.domain}${API.endPoints.getAllContactForm}`
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to fetch contact forms");
    }

    throw new Error("Failed to fetch contact forms");
  } catch (error: any) {
    console.error("Error fetching contact forms:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch contact forms");
    }
  }
};

/**
 * Get contact form by ID
 * @param id - Contact form ID
 * @returns Contact form data
 */
export const getContactFormById = async (id: string) => {
  try {
    const response: any = await axios.get(
      `${API.domain}${API.endPoints.getContactFormById}${id}`
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to fetch contact form");
    }

    throw new Error("Failed to fetch contact form");
  } catch (error: any) {
    console.error("Error fetching contact form:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch contact form");
    }
  }
};

/**
 * Update contact form by ID
 * @param id - Contact form ID
 * @param contactForm - Updated contact form data
 * @returns Updated contact form data
 */
export const updateContactForm = async (id: string, contactForm: any) => {
  try {
    const response: any = await axios.put(
      `${API.domain}${API.endPoints.updateContactForm}${id}`,
      contactForm
    );

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to update contact form");
    }

    throw new Error("Failed to update contact form");
  } catch (error: any) {
    console.error("Error updating contact form:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to update contact form");
    }
  }
};

/**
 * Delete contact form by ID
 * @param id - Contact form ID
 * @returns Success message
 */
export const deleteContactForm = async (id: string) => {
  try {
    const response: any = await axios.delete(
      `${API.domain}${API.endPoints.deleteContactForm}${id}`
    );

    if (response.status === 200 && response.data.success) {
      return response.data.message || "Contact form deleted successfully";
    }

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || "Failed to delete contact form");
    }

    throw new Error("Failed to delete contact form");
  } catch (error: any) {
    console.error("Error deleting contact form:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete contact form");
    }
  }
};

// Legacy function for backward compatibility
export const createContact = createContactForm;