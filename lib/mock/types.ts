/**
 * TYPE DEFINITIONS - Simple Ink Studios Business Models
 *
 * This file contains TypeScript type definitions for core business entities
 * used throughout the Simple Ink Studios management platform.
 *
 * Key Types:
 * - Client: Individual client/customer records
 * - Column: Pipeline stages (Lead, Contacted, Proposal, etc.)
 *
 * These types ensure type safety across components and API interactions.
 * They will be extended as new features are added to the platform.
 */

/**
 * Client Type - Represents a customer/client in the system
 *
 * Properties:
 * - id: Unique identifier (will become Supabase UUID)
 * - name: Client's full name or business name
 * - contact: Primary contact method (email, phone)
 * - artist: Optional assigned artist for the project
 */
export type Client = {
  id: string;
  name: string;
  contact: string;
  artist?: string; // Optional field for assigned artist;
};

/**
 * Column Type - Represents a pipeline stage/column
 *
 * Properties:
 * - id: Unique identifier for the column (e.g., 'leads', 'contacted', 'proposal')
 * - title: Display name for the column (e.g., 'New Leads', 'In Progress')
 * - clients: Array of clients currently in this pipeline stage
 */
export type Column = {
  id: string; // e.g., 'leads', 'consulting'
  title: string;
  clients: Client[];
};
