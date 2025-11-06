import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const my_preset_theme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{rose.50}',
            100: '{rose.100}',
            200: '{rose.200}',
            300: '{rose.300}',
            400: '{rose.400}',
            500: '{rose.500}',
            600: '{rose.600}',
            700: '{rose.700}',
            800: '{rose.800}',
            900: '{rose.900}',
            950: '{rose.950}'
        },
        colorScheme: {
            light: {
            },
            dark: {
            }
        }
    }
});
