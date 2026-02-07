<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Cafeteria System</title>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body class="antialiased bg-gray-100 text-gray-900">

        <div id="app">
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; color: #666;">
                Loading Application...
            </div>
        </div>

    </body>
</html>
