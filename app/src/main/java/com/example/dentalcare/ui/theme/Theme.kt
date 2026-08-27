package com.example.dentalcare.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// --- Material Design 3 DentalCare Color Tokens ---
val PrimaryM3 = Color(0xFF1976D2)       // Medical Blue
val SecondaryM3 = Color(0xFF26A69A)     // Teal
val TertiaryM3 = Color(0xFF4F46E5)      // Indigo Accent
val BackgroundM3Light = Color(0xFFF8FAFC)
val SurfaceM3Light = Color(0xFFFFFFFF)
val SuccessM3 = Color(0xFF4CAF50)
val WarningM3 = Color(0xFFFFC107)
val ErrorM3 = Color(0xFFF44336)

val PrimaryContainerLight = Color(0xFFE3F2FD)
val OnPrimaryContainerLight = Color(0xFF0D47A1)
val SecondaryContainerLight = Color(0xFFE0F2F1)
val OnSecondaryContainerLight = Color(0xFF004D40)

// Dark Palette
val BackgroundM3Dark = Color(0xFF0F172A)
val SurfaceM3Dark = Color(0xFF1E293B)
val PrimaryDark = Color(0xFF90CAF9)
val SecondaryDark = Color(0xFF80CBC4)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryM3,
    secondary = SecondaryM3,
    tertiary = TertiaryM3,
    background = BackgroundM3Light,
    surface = SurfaceM3Light,
    error = ErrorM3,
    primaryContainer = PrimaryContainerLight,
    onPrimaryContainer = OnPrimaryContainerLight,
    secondaryContainer = SecondaryContainerLight,
    onSecondaryContainer = OnSecondaryContainerLight
)

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryDark,
    secondary = SecondaryDark,
    tertiary = TertiaryM3,
    background = BackgroundM3Dark,
    surface = SurfaceM3Dark,
    error = ErrorM3
)

// --- M3 Typography Scale ---
val Typography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 40.sp,
        lineHeight = 48.sp,
        letterSpacing = (-0.25).sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 28.sp,
        lineHeight = 36.sp,
        letterSpacing = 0.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp
    )
)

@Composable
fun DentalCareTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
