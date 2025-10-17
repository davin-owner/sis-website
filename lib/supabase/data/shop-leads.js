import { supabase } from "../../supabase";

/**
 * GET SHOP LEAD DATA
 */

export const getShopLeadData = async () => {
  // Make the data qurey so it will return either data or a error
  const { data, error } = await supabase.from("shop_leads").select();

  // Error Handleing
  if (error) {
    console.error("Error fetching Shop Lead Data", error);

    throw error;
  }

  // Fetched Data successfully or if it has no data
  if (!data || data.length === 0) {
    console.log("No Shop leads found!");
    return data;
  } else console.log("Shop Lead Data fetch successfully:", data);
  return data;
};
