<?php

if (!function_exists('vite')) {
    function vite()
    {
        $hotFile = ROOTPATH . '.vite/hot';
        $isDev = is_file($hotFile);
        $devUrl = 'http://localhost:5173';

        if ($isDev) {
            return "<script type='module' src='{$devUrl}/@vite/client'></script>"
                . "<script type='module' src='{$devUrl}/resources/js/app.js'></script>";
        }

        $assets = @include FCPATH . 'vite.php';
        if (!is_array($assets)) {
            return '';
        }

        $tags = '';
        foreach ($assets as $asset) {
            if (str_ends_with($asset, '.js')) {
                $tags .= "<script type='module' src='{$asset}'></script>";
            } elseif (str_ends_with($asset, '.css')) {
                $tags .= "<link rel='stylesheet' href='{$asset}'>";
            }
        }

        return $tags;
    }
}
