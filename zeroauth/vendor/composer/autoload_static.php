<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit5ef75828fae2e57cb866fb52f7db52e5
{
    public static $prefixLengthsPsr4 = array (
        'V' => 
        array (
            'Vincent\\Zeroauth\\' => 17,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Vincent\\Zeroauth\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit5ef75828fae2e57cb866fb52f7db52e5::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit5ef75828fae2e57cb866fb52f7db52e5::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit5ef75828fae2e57cb866fb52f7db52e5::$classMap;

        }, null, ClassLoader::class);
    }
}
