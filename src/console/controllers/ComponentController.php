<?php

namespace craft\console\controllers;

use Craft;
use craft\console\Controller as ControllerAlias;
use craft\helpers\App;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\web\View;
use yii\console\ExitCode;

class ComponentController extends ControllerAlias
{
    public function actionGenerate()
    {
        $viewService = Craft::$app->getView();
        $viewService->setTemplateMode(View::TEMPLATE_MODE_CP);
        $path = $viewService->getTemplatesPath();

        $outputDir = dirname(App::parseEnv('@craft')) . '/build';

        FileHelper::clearDirectory($outputDir);

        $files = FileHelper::findFiles($path, [
            'only' => ['*.stories.json'],
        ]);

        $cpAssets = FileHelper::findFiles(App::parseEnv('@app/web/assets/cp/dist'), [
            'only' => ['*.css', '*.js'],
        ]);

        foreach ($cpAssets as $cpAsset) {
            $filename = last(explode('/', $cpAsset));
            copy($cpAsset, $outputDir . '/' . $filename);
        }

        foreach ($files as $file) {
            $data = Json::decode(@file_get_contents($file));

            foreach ($data['variants'] as $variant) {
                $outputFile = $outputDir . '/' . StringHelper::toKebabCase($data['name'] . '-' . $variant['name']) . '.html';
                $component = $viewService->renderTemplate($data['source'], array_merge($data['variables'], $variant['variables']));

                $output = $viewService->renderTemplate('_layouts/preview', [
                    'css' => 'cp.css',
                    'js' => 'cp.js',
                    'preview' => $component,
                ]);
                FileHelper::writeToFile($outputFile, $output);
                $this->stdout('Successfully wrote ' . $outputFile . PHP_EOL);
            }
        }

        return ExitCode::OK;
    }
}
