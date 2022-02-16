import {
  DefaultTheme,
  DefaultThemeRenderContext,
  Options,
  RendererEvent,
} from 'typedoc';
import { Renderer } from 'typedoc/dist/lib/output/renderer';
import { copy } from 'fs-extra';
import path from 'node:path';

import { navigation } from '../partials/navigation';
import {container} from '../partials/properties';
class BeautabOverrideThemeContext extends DefaultThemeRenderContext {
  public constructor(theme: DefaultTheme, options: Options) {
    super(theme, options);

    // 重新渲染导航栏
    this.navigation = navigation(this.urlTo.bind(this));
    // 重新渲染分模板页面
    this.reflectionTemplate = container(this.urlTo.bind(this));

    // 重新渲染主页面（index.html）
    // this.indexTemplate
  }
}

/**
 * 覆盖默认主题
 */
export class BeautabOverrideTheme extends DefaultTheme {
  private _contextCache?: BeautabOverrideThemeContext;

  public constructor(renderer: Renderer) {
    super(renderer);

    this.listenTo(this.owner, RendererEvent.END, async () => {
      const out = this.application.options.getValue('out');

      await copy(
        path.join(
          process.cwd(),
          '/node_modules/typedoc-theme-beautab/dist/assets',
        ),
        path.join(out, '/assets'),
      );
    });
  }

  override getRenderContext(): BeautabOverrideThemeContext {
    this._contextCache ||= new BeautabOverrideThemeContext(
      this,
      this.application.options,
    );

    return this._contextCache;
  }
}
