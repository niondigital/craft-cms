<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license https://craftcms.github.io/license/
 */

namespace craft\controllers;

use Craft;
use craft\helpers\Image;
use craft\models\ImageTransform;
use craft\web\assets\edittransform\EditTransformAsset;
use craft\web\Controller;
use yii\web\NotFoundHttpException;
use yii\web\Response;

/**
 * The ImageTransformsController class is a controller that handles various actions related to image transforms,
 * such as creating, editing and deleting transforms.
 * Note that all actions in the controller require an authenticated Craft session via [[allowAnonymous]].
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 4.0.0
 */
class ImageTransformsController extends Controller
{
    /**
     * @inheritdoc
     */
    public function beforeAction($action): bool
    {
        // All image transform actions require an admin
        $this->requireAdmin();

        return parent::beforeAction($action);
    }

    /**
     * Shows the image transform index.
     *
     * @return Response
     */
    public function actionIndex(): Response
    {
        $variables = [];

        $variables['transforms'] = Craft::$app->getImageTransforms()->getAllTransforms();
        $variables['modes'] = ImageTransform::modes();

        return $this->renderTemplate('settings/assets/transforms/_index', $variables);
    }

    /**
     * Edit an image transform.
     *
     * @param string|null $transformHandle The transform’s handle, if any.
     * @param ImageTransform|null $transform The transform being edited, if there were any validation errors.
     * @return Response
     * @throws NotFoundHttpException if the requested transform cannot be found
     */
    public function actionEdit(?string $transformHandle = null, ?ImageTransform $transform = null): Response
    {
        if ($transform === null) {
            if ($transformHandle !== null) {
                $transform = Craft::$app->getImageTransforms()->getTransformByHandle($transformHandle);

                if (!$transform) {
                    throw new NotFoundHttpException('Transform not found');
                }
            } else {
                $transform = new ImageTransform();
            }
        }

        $this->getView()->registerAssetBundle(EditTransformAsset::class);

        if ($transform->id) {
            $title = trim($transform->name) ?: Craft::t('app', 'Edit Image Transform');
        } else {
            $title = Craft::t('app', 'Create a new image transform');
        }

        return $this->renderTemplate('settings/assets/transforms/_settings', [
            'handle' => $transformHandle,
            'transform' => $transform,
            'title' => $title,
        ]);
    }

    /**
     * Saves an image transform.
     *
     * @return Response|null
     */
    public function actionSave(): ?Response
    {
        $this->requirePostRequest();

        $transform = new ImageTransform();
        $transform->id = $this->request->getBodyParam('transformId');
        $transform->name = $this->request->getBodyParam('name');
        $transform->handle = $this->request->getBodyParam('handle');
        $transform->width = $this->request->getBodyParam('width');
        $transform->height = $this->request->getBodyParam('height');
        $transform->mode = $this->request->getBodyParam('mode');
        $transform->position = $this->request->getBodyParam('position');
        $transform->quality = $this->request->getBodyParam('quality');
        $transform->interlace = $this->request->getBodyParam('interlace');
        $transform->format = $this->request->getBodyParam('format');

        if (empty($transform->format)) {
            $transform->format = null;
        }

        // TODO: This validation should be handled on the transform object
        $errors = false;

        if (empty($transform->width) && empty($transform->height)) {
            $this->setFailFlash(Craft::t('app', 'You must set at least one of the dimensions.'));
            $errors = true;
        }

        if (!empty($transform->quality) && (!is_numeric($transform->quality) || $transform->quality > 100 || $transform->quality < 1)) {
            $this->setFailFlash(Craft::t('app', 'Quality must be a number between 1 and 100 (included).'));
            $errors = true;
        }

        if (empty($transform->quality)) {
            $transform->quality = null;
        }

        if (!empty($transform->format) && !in_array($transform->format, Image::webSafeFormats(), true)) {
            $this->setFailFlash(Craft::t('app', 'That is not an allowed format.'));
            $errors = true;
        }

        if (!$errors) {
            $success = Craft::$app->getImageTransforms()->saveTransform($transform);
        } else {
            $success = false;
        }

        if (!$success) {
            return $this->asModelFailure($transform, modelName: 'transform');
        }

        return $this->asModelSuccess(
            $transform,
            Craft::t('app', 'Transform saved.'),
        );
    }

    /**
     * Deletes an image transform.
     *
     * @return Response
     */
    public function actionDelete(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $transformId = $this->request->getRequiredBodyParam('id');

        Craft::$app->getImageTransforms()->deleteTransformById($transformId);

        return $this->asSuccess();
    }
}
