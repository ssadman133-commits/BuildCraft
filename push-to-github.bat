@echo off
echo ====================================================
echo        BUILDCRAFT - PUSHING TO GITHUB
echo        Repo: https://github.com/ssadman133-commits/BuildCraft.git
echo ====================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Code and all assets successfully pushed to GitHub!
) else (
    echo [NOTE] If prompted for credentials, please sign in via browser or provide your GitHub Personal Access Token (PAT).
)
echo.
pause
