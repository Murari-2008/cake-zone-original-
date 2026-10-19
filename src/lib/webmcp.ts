import { MenuItem } from '../types';

export function setupWebMcp() {
  if (typeof window !== 'undefined') {
    if (!(window as any).__webmcpTools) {
      (window as any).__webmcpTools = {};
    }
  }

  // 1. Establish robust polyfill for navigator.modelContext
  if (typeof window !== 'undefined') {

    if (!(navigator as any).modelContext) {
      const tools = new Map();
      (navigator as any).modelContext = {
        registerTool: (tool: any) => {
          tools.set(tool.name, tool);
          (window as any).__webmcpTools[tool.name] = tool;
          console.log(`[WebMCP Polyfill] Registered tool: ${tool.name}`);
          return {
            unregister: () => {
              tools.delete(tool.name);
              delete (window as any).__webmcpTools[tool.name];
            }
          };
        },
        getRegisteredTools: () => Array.from(tools.values())
      };
    } else {
      // Native modelContext exists. If we haven't wrapped its registerTool yet, let's wrap it to ensure window.__webmcpTools gets populated for console testing.
      const originalRegisterTool = (navigator as any).modelContext.registerTool;
      if (originalRegisterTool && !(navigator as any).modelContext.__isWrappedForConsole) {
        (navigator as any).modelContext.registerTool = (tool: any) => {
          (window as any).__webmcpTools[tool.name] = tool;
          console.log(`[WebMCP Native Wrapper] Tracked registered tool: ${tool.name}`);
          const registration = originalRegisterTool.call((navigator as any).modelContext, tool);
          return {
            unregister: () => {
              delete (window as any).__webmcpTools[tool.name];
              if (registration && typeof registration.unregister === 'function') {
                registration.unregister();
              }
            }
          };
        };
        (navigator as any).modelContext.__isWrappedForConsole = true;
      } else if (!originalRegisterTool) {
        (navigator as any).modelContext.registerTool = (tool: any) => {
          (window as any).__webmcpTools[tool.name] = tool;
          console.log(`[WebMCP Polyfill] Registered tool: ${tool.name}`);
          return {
            unregister: () => {
              delete (window as any).__webmcpTools[tool.name];
            }
          };
        };
      }
    }

    // 2. Register Tool 1: get_catalog
    (navigator as any).modelContext.registerTool({
      name: 'get_catalog',
      description: 'Retrieve all available cake categories, items, prices, and live stock levels from Cake Zone menu.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false
      },
      execute: async () => {
        const menu = (window as any).__cz_menu_items || [];
        return {
          success: true,
          catalog: menu.map((it: MenuItem) => ({
            id: it.id,
            name: it.name,
            category: it.category,
            subCategory: it.subCategory,
            price: it.price,
            description: it.description,
            inStock: it.inStock,
            isSeasonal: it.isSeasonal
          }))
        };
      }
    });

    // 3. Register Tool 2: configure_theme_cake
    (navigator as any).modelContext.registerTool({
      name: 'configure_theme_cake',
      description: 'Configure and customize the bespoke theme cake parameters inside the "Curate Ur Perfect Cake" custom builder.',
      inputSchema: {
        type: 'object',
        properties: {
          flavour: {
            type: 'string',
            description: 'The batter/filling flavour of the cake (e.g. "Vanilla", "Chocolate", "Black Forest", "Pineapple", "Red Velvet", "Butterscotch")'
          },
          shape: {
            type: 'string',
            enum: ['Round', 'Rectangle', 'Heart'],
            description: 'The physical shape of the cake'
          },
          weight: {
            type: 'string',
            enum: ['0.5 kg', '1.0 kg', '2.0 kg', '5.0 kg'],
            description: 'The total weight of the custom cake'
          },
          photoPrint: {
            type: 'string',
            enum: ['Yes', 'No'],
            description: 'Toggle whether edible PhotoPrint image rendering is enabled'
          },
          icingText: {
            type: 'string',
            description: 'Custom text message written in icing on top of the cake'
          },
          cakeType: {
            type: 'string',
            enum: ['Normal', 'Eggless'],
            description: 'Choose between standard cake batter or eggless cake'
          },
          topping: {
            type: 'string',
            description: 'Topping garnish/embellishment (e.g. "Chocolate Chips", "Almonds", "Cherries", "Gems")'
          }
        },
        required: ['flavour', 'shape', 'weight', 'photoPrint', 'icingText']
      },
      execute: async (args: {
        flavour: string;
        shape: 'Round' | 'Rectangle' | 'Heart';
        weight: string;
        photoPrint: 'Yes' | 'No';
        icingText: string;
        cakeType?: 'Normal' | 'Eggless';
        topping?: string;
      }) => {
        if (typeof (window as any).__configureThemeCake === 'function') {
          return (window as any).__configureThemeCake(args);
        }
        return {
          success: false,
          error: "Theme cake configurator is not currently loaded on this screen. Ensure you are on the Custom Curator page."
        };
      }
    });

    // 4. Register Tool 3: checkout_and_bill
    (navigator as any).modelContext.registerTool({
      name: 'checkout_and_bill',
      description: 'Initiate order placement checkout with contact parameters, apply dynamic estimates/loyalty options, and download the finalized receipt bill image.',
      inputSchema: {
        type: 'object',
        properties: {
          clientName: {
            type: 'string',
            description: 'Full name of the pre-order client'
          },
          whatsApp: {
            type: 'string',
            description: 'WhatsApp mobile contact phone number for updates'
          },
          mail: {
            type: 'string',
            description: 'Email address of the client to dispatch confirmation receipt'
          },
          address: {
            type: 'string',
            description: 'Custom shipping/delivery estimate address'
          },
          redeemLoyaltyOption: {
            type: 'string',
            enum: ['none', 'redeem'],
            description: 'Choose Option A ("none") or Option B ("redeem") to apply loyalty point points'
          }
        },
        required: ['clientName', 'whatsApp', 'mail']
      },
      execute: async (args: {
        clientName: string;
        whatsApp: string;
        mail: string;
        address?: string;
        redeemLoyaltyOption?: 'none' | 'redeem';
      }) => {
        // Step A: If basket is empty, try to auto-add current custom cake from builder
        let hasItems = false;
        if ((window as any).__triggerCheckout) {
          const cart = (window as any).__cz_cart_items || [];
          if (cart.length > 0) {
            hasItems = true;
          }
        }

        if (!hasItems) {
          if (typeof (window as any).__addCustomCakeToCart === 'function') {
            const addResult = (window as any).__addCustomCakeToCart(
              args.clientName,
              args.whatsApp,
              args.mail,
              args.redeemLoyaltyOption || 'none'
            );
            if (!addResult.success) {
              return { success: false, error: "Failed to add customized cake to cart automatically." };
            }
          } else {
            return {
              success: false,
              error: "Cart is empty and the custom cake configurator is not loaded. Add items to your cart first."
            };
          }
        }

        // Open the cart modal
        if (typeof (window as any).__setCartOpen === 'function') {
          (window as any).__setCartOpen(true);
        }

        // Give a tiny moment to let CartModal state mount/settle
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Step B: Trigger the actual checkout
        if (typeof (window as any).__triggerCheckout === 'function') {
          return (window as any).__triggerCheckout({
            name: args.clientName,
            email: args.mail,
            phone: args.whatsApp,
            address: args.address || 'Co-operative Colony, Kadapa',
            redeemPoints: args.redeemLoyaltyOption === 'redeem'
          });
        }

        return {
          success: false,
          error: "Checkout service is currently offline or Cart Modal is not available."
        };
      }
    });
  }
}
