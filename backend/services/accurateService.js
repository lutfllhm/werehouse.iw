/**
 * SERVICE ACCURATE ONLINE
 * 
 * File ini berisi class untuk berkomunikasi dengan Accurate Online API.
 * Accurate Online adalah software akuntansi cloud yang digunakan untuk:
 * - Mengelola data produk/item
 * - Mengelola sales order
 * - Mengelola data pelanggan
 * 
 * Service ini digunakan untuk sinkronisasi data dari Accurate ke database lokal
 */

const axios = require('axios');
require('dotenv').config();

class AccurateService {
  constructor() {
    // Konfigurasi API Accurate dari environment variables
    this.baseURL = process.env.ACCURATE_API_URL;
    this.accessToken = process.env.ACCURATE_ACCESS_TOKEN;
    this.databaseId = process.env.ACCURATE_DATABASE_ID;
  }

  /**
   * Fungsi Get Headers
   * Membuat header untuk request ke Accurate API
   */
  async getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'X-Session-ID': this.databaseId,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Fungsi Get Products
   * Mengambil daftar produk/item dari Accurate Online
   */
  async getProducts() {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseURL}/item/list.do`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error saat mengambil produk dari Accurate:', error.message);
      throw error;
    }
  }

  /**
   * Fungsi Get Sales Orders
   * Mengambil daftar sales order dari Accurate Online
   */
  async getSalesOrders() {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseURL}/sales-order/list.do`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error saat mengambil sales order dari Accurate:', error.message);
      throw error;
    }
  }

  /**
   * Fungsi Get Sales Order Detail
   * Mengambil detail sales order berdasarkan ID
   */
  async getSalesOrderDetail(orderId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseURL}/sales-order/detail.do?id=${orderId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error saat mengambil detail sales order:', error.message);
      throw error;
    }
  }
}

// Export instance dari AccurateService
module.exports = new AccurateService();
