-- SIS - Tabla de postulaciones (MySQL 8 / MariaDB en Hostinger)
-- Ejecutar SOLO si se opta por phpMyAdmin manualmente en lugar de npx prisma db push.
-- Ejecutar tras respaldo. No elimina ni cambia ninguna tabla existente.
CREATE TABLE IF NOT EXISTS `PostulacionTalento` (
  `id` VARCHAR(191) NOT NULL,
  `nombreCompleto` VARCHAR(120) NOT NULL,
  `correo` VARCHAR(190) NOT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `ciudad` VARCHAR(120) NOT NULL,
  `profesion` VARCHAR(140) NOT NULL,
  `aniosExperiencia` INTEGER NOT NULL DEFAULT 0,
  `modalidad` ENUM('PRESENCIAL','VIRTUAL','MIXTA') NOT NULL,
  `mensaje` TEXT NULL,
  `estado` ENUM('PENDIENTE','RECIBIDA','EN_REVISION','DESCARTADA') NOT NULL DEFAULT 'PENDIENTE',
  `hojaVidaNombre` VARCHAR(180) NOT NULL,
  `hojaVidaPublicId` VARCHAR(240) NOT NULL,
  `hojaVidaAssetId` VARCHAR(80) NULL,
  `hojaVidaBytes` INTEGER NULL,
  `tokenHash` CHAR(64) NOT NULL,
  `tokenExpiraEn` DATETIME(3) NOT NULL,
  `consentimientoEn` DATETIME(3) NOT NULL,
  `utmSource` VARCHAR(120) NULL,
  `utmMedium` VARCHAR(120) NULL,
  `utmCampaign` VARCHAR(150) NULL,
  `utmContent` VARCHAR(150) NULL,
  `ipHash` CHAR(64) NULL,
  `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizadoEn` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `PostulacionTalento_hojaVidaPublicId_key` (`hojaVidaPublicId`),
  INDEX `PostulacionTalento_estado_creadoEn_idx` (`estado`, `creadoEn`),
  INDEX `PostulacionTalento_correo_creadoEn_idx` (`correo`, `creadoEn`),
  INDEX `PostulacionTalento_ipHash_creadoEn_idx` (`ipHash`, `creadoEn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Control de verificación sin exponer hojas de vida:
SELECT `id`, `nombreCompleto`, `correo`, `ciudad`, `profesion`,
       `estado`, `hojaVidaNombre`, `creadoEn`
FROM `PostulacionTalento`
WHERE `estado` = 'RECIBIDA'
ORDER BY `creadoEn` DESC
LIMIT 50;
