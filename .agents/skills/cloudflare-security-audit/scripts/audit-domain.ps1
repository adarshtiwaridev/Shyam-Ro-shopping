param(
    [Parameter(Mandatory=$true)]
    [string]$Domain
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Cloudflare Security Audit: $Domain" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. DNS & IP Obfuscation Check
Write-Host "`n[1] Checking DNS & Cloudflare Anycast Proxy..." -ForegroundColor Yellow
try {
    $ips = [System.Net.Dns]::GetHostAddresses($Domain) | ForEach-Object { $_.IPAddressToString }
    Write-Host "Resolved IPs for $Domain : $($ips -join ', ')"
    $isCf = $ips | Where-Object { $_ -match "^104\.|^172\.67\.|^198\.41\.|^108\.162\.|^162\.158\.|^173\.245\." }
    if ($isCf) {
        Write-Host "✓ Domain is proxied through Cloudflare Anycast IPs (Orange Cloud active)" -ForegroundColor Green
    } else {
        Write-Host "⚠ WARNING: IP address does not match known Cloudflare ranges. Verify Proxy status (Orange Cloud)." -ForegroundColor Red
    }
} catch {
    Write-Host "Error resolving DNS: $_" -ForegroundColor Red
}

# 2. HTTPS & Edge Headers Check
Write-Host "`n[2] Checking Edge Response Headers & Security Policies..." -ForegroundColor Yellow
try {
    $url = "https://$Domain"
    $response = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -MaximumRedirection 5
    
    # Check CF-Ray
    if ($response.Headers["CF-RAY"]) {
        Write-Host "✓ Cloudflare CF-RAY detected: $($response.Headers['CF-RAY'])" -ForegroundColor Green
    } else {
        Write-Host "⚠ CF-RAY header not found. Cloudflare edge proxy may not be active." -ForegroundColor Red
    }
    
    # Check HSTS
    if ($response.Headers["Strict-Transport-Security"]) {
        Write-Host "✓ HSTS Header: $($response.Headers['Strict-Transport-Security'])" -ForegroundColor Green
    } else {
        Write-Host "✗ HSTS Header missing: Enforce HSTS (max-age=31536000; includeSubDomains; preload)" -ForegroundColor Red
    }

    # Check X-Content-Type-Options
    if ($response.Headers["X-Content-Type-Options"]) {
        Write-Host "✓ X-Content-Type-Options: $($response.Headers['X-Content-Type-Options'])" -ForegroundColor Green
    } else {
        Write-Host "⚠ X-Content-Type-Options header missing. Consider adding 'nosniff'." -ForegroundColor Yellow
    }

    # Check X-Frame-Options
    if ($response.Headers["X-Frame-Options"]) {
        Write-Host "✓ X-Frame-Options: $($response.Headers['X-Frame-Options'])" -ForegroundColor Green
    } else {
        Write-Host "⚠ X-Frame-Options header missing (Clickjacking protection)." -ForegroundColor Yellow
    }

} catch {
    Write-Host "Failed to connect to https://$Domain : $_" -ForegroundColor Red
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "Audit check complete." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

