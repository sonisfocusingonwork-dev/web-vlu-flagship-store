@echo off
chcp 65001 >nul
set "PATH=C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd;%PATH%"

echo ===================================================================
echo   VLU FLAGSHIP STORE - ĐẨY CODE LÊN GITHUB (MAIN ^& DEV)
echo ===================================================================
echo.
echo [1/2] Đang đẩy nhánh 'main' lên GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo [LỖI] Chưa thể đẩy nhánh main. Vui lòng kiểm tra quyền truy cập GitHub.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Đang đẩy nhánh 'dev' lên GitHub...
git push -u origin dev
if %errorlevel% neq 0 (
    echo [LỖI] Chưa thể đẩy nhánh dev.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================================
echo   THÀNH CÔNG! Cả 2 nhánh 'main' và 'dev' đã xuất hiện trên GitHub.
echo ===================================================================
pause
