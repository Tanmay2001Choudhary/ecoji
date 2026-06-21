export type ThemeName = 'premium-eco' | 'modern-eco' | 'bamboo' | 'luxury-eco'
export type FontName = 'Poppins' | 'Inter' | 'Montserrat' | 'Lora' | 'Playfair Display' | 'Nunito'

export interface AppThemeConfig {
  theme: ThemeName
  font: FontName
}
