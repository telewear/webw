import { SettingSection } from "..";
import { hexaToRgba } from "../../../helpers/color";
import { attachClickEvent } from "../../../helpers/dom";
import findUpClassName from "../../../helpers/dom/findUpClassName";
import highlightningColor from "../../../helpers/highlightningColor";
import { throttle } from "../../../helpers/schedulers";
import appImManager from "../../../lib/appManagers/appImManager";
import appStateManager from "../../../lib/appManagers/appStateManager";
import rootScope from "../../../lib/rootScope";
import ColorPicker, { ColorPickerColor } from "../../colorPicker";
import { SliderSuperTab } from "../../slider";

export default class AppBackgroundColorTab extends SliderSuperTab {
  private colorPicker: ColorPicker;
  private grid: HTMLElement;
  private applyColor: (hex: string, updateColorPicker?: boolean) => void;

  init() {
    this.container.classList.add('background-container', 'background-color-container');
    this.setTitle('SetColor');

    const section = new SettingSection({});
    this.colorPicker = new ColorPicker();

    section.content.append(this.colorPicker.container);

    this.scrollable.append(section.container);

    const grid = this.grid = document.createElement('div');
    grid.classList.add('grid');

    const colors = [
      '#E6EBEE',
      '#B2CEE1',
      '#008DD0',
      '#C6E7CB',
      '#C4E1A6',
      '#60B16E',
      '#CCD0AF',
      '#A6A997',
      '#7A7072',
      '#FDD7AF',
      '#FDB76E',
      '#DD8851'
    ];

    colors.forEach(color => {
      const item = document.createElement('div');
      item.classList.add('grid-item');
      item.dataset.color = color.toLowerCase();

      // * need for transform scale
      const media = document.createElement('div');
      media.classList.add('grid-item-media');
      media.style.backgroundColor = color;

      item.append(media);
      grid.append(item);
    });

    attachClickEvent(grid, (e) => {
      const target = findUpClassName(e.target, 'grid-item');
      if(!target || target.classList.contains('active')) {
        return;
      }

      const color = target.dataset.color;
      if(!color) {
        return;
      }

      this.applyColor(color);
    }, {listenerSetter: this.listenerSetter});

    this.scrollable.append(grid);

    this.applyColor = throttle(this._applyColor, 16, true);
  }

  private setActive() {
    const active = this.grid.querySelector('.active');
    const background = rootScope.settings.themes.find(t => t.name === rootScope.settings.theme).background;
    const target = background.type === 'color' ? this.grid.querySelector(`.grid-item[data-color="${background.color}"]`) : null;
    if(active === target) {
      return;
    }

    if(active) {
      active.classList.remove('active');
    }

    if(target) {
      target.classList.add('active');
    }
  }

  private _applyColor = (hex: string, updateColorPicker = true) => {
    if(updateColorPicker) {
      this.colorPicker.setColor(hex);
    } else {
      const rgba = hexaToRgba(hex);
      const background = rootScope.settings.themes.find(t => t.name === rootScope.settings.theme).background;
      const hsla = highlightningColor(rgba);
    
      background.color = hex.toLowerCase();
      background.type = 'color';
      background.highlightningColor = hsla;
      appStateManager.pushToState('settings', rootScope.settings);
    
      appImManager.applyCurrentTheme(undefined, undefined, true);
      this.setActive();
    }
  };

  private onColorChange = (color: ColorPickerColor) => {
    this.applyColor(color.hex, false);
  };

  onOpen() {
    setTimeout(() => {
      const background = rootScope.settings.themes.find(t => t.name === rootScope.settings.theme).background;

      // * set active if type is color
      if(background.type === 'color') {
        this.colorPicker.onChange = this.onColorChange;
      }

      this.colorPicker.setColor(background.color || '#cccccc');
      
      if(background.type !== 'color') {
        this.colorPicker.onChange = this.onColorChange;
      }
    }, 0);
  }

  onCloseAfterTimeout() {
    this.colorPicker.onChange = undefined;
    this.colorPicker = undefined;

    return super.onCloseAfterTimeout();
  }
}
