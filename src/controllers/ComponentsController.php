<?php

namespace craft\controllers;

use Craft;
use craft\web\assets\cp\CpAsset;

class ComponentsController extends \craft\web\Controller
{
    protected array|bool|int $allowAnonymous = ['preview'];

    public function beforeAction($action): bool
    {
        if ($action->id === 'preview') {
            $this->response->getHeaders()
                ->add('Access-Control-Allow-Origin', '*')
                ->add('Access-Control-Allow-Credentials', 'true');
        }

        return parent::beforeAction($action);
    }

    public function actionPreview($templatePath = null)
    {
        $this->view->registerAssetBundle(CpAsset::class);
        $vars = Craft::$app->getRequest()->getQueryParams();
        $preview = $this->view->renderTemplate($templatePath, $vars);

        return $this->renderTemplate('_layouts/preview', ['preview' => $preview]);
    }
}
