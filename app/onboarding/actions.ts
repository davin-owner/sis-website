'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Server Action to create a new shop for the authenticated user
 *
 * This runs on the server and has access to the user's session,
 * so RLS policies will work correctly.
 */
export async function createShop(formData: FormData) {
  // Get the authenticated user from the server session
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    return { error: 'Not authenticated' }
  }

  // Extract form data
  const shopName = formData.get('shop_name') as string
  const shopAddress = formData.get('shop_address') as string

  // Validate inputs
  if (!shopName || !shopAddress) {
    return { error: 'Shop name and address are required' }
  }

  try {
    // Step 1: Create the shop (workers will be added via Artists page)
    const { data: newShop, error: shopError } = await supabase
      .from('shops_tables')
      .insert({
        shop_name: shopName,
        shop_address: shopAddress,
        amount_of_workers: 0, // Default to 0, will update when workers are added
        shop_owner: user.id,
      })
      .select()
      .single()

    if (shopError) {
      return { error: `Failed to create shop: ${shopError.message}` }
    }

    // Step 2: Add user to shop_users junction table
    const { error: junctionError } = await supabase
      .from('shop_users')
      .insert({
        user_id: user.id,
        shop_id: newShop.shop_id,
        role: 'owner',
        permissions: {
          can_edit_settings: true,
          can_manage_workers: true,
          can_manage_leads: true,
          can_view_reports: true,
          can_delete_shop: true,
        },
        last_accessed_at: new Date().toISOString(),
      })

    if (junctionError) {
      // Rollback: Delete the shop we just created
      await supabase
        .from('shops_tables')
        .delete()
        .eq('shop_id', newShop.shop_id)

      return { error: `Failed to setup shop access: ${junctionError.message}` }
    }

    // Success! Return success status
    return { success: true, shopId: newShop.shop_id }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}
