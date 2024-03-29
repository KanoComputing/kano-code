/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { IDisposable } from '@kano/common/index.js';

/**
 * A contribution management utility class
 * Define a type and register items using this class
 */
export class ContributionManager<T> {
    private contributions : Map<string, T> = new Map();
    register(id : string, item : T) : IDisposable {
        this.contributions.set(id, item);
        return {
            dispose: () => {
                this.contributions.delete(id);
            },
        };
    }
    get(id : string) {
        return this.contributions.get(id);
    }
    dispose() {
        this.contributions.clear();
    }
}
