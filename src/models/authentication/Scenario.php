<?php
declare(strict_types=1);
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license https://craftcms.github.io/license/
 */

namespace craft\models\authentication;

use craft\base\Model;

/**
 * Authentication chain scenario model class
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 4.0.0
 *
 * @property-read null|string $defaultBranchName
 */
class Scenario extends Model
{
    /**
     * Slightly massage the branch data before using.
     *
     * @param array $config
     */
    public function __construct($config = [])
    {
        $branches = [];

        foreach ($config['branches'] as $branch) {
            $branches[$branch['title']] = [
                'steps' => $branch['steps']
            ];
        }
        
        $config['branches'] = $branches;
            
        parent::__construct($config);
    }

    /**
     * Auth chain branches.
     *
     * @var Branch[]
     */
    public array $branches = [];

    /**
     * @var string Scenario name
     */
    public string $scenarioName = '';

    /**
     * Get the default branch name for an auth chain.
     *
     * @return string|null
     */
    public function getDefaultBranchName(): ?string
    {
        return array_keys($this->branches)[0] ?? null;
    }
}