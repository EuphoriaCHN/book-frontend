import { observable, computed, action } from 'mobx';

import { Books } from 'container/Platform/Platform';

class ProjectStore {
  /**
   * 统一处理点击书籍，展开缩略 Modal 的加载逻辑
   */
  @observable bookModalVisible: boolean = false;
  @observable modalBooks: Books = null;

  @action.bound
  setBookModalVisible(target: boolean, book?: Books) {
    this.modalBooks = target ? book : null;
    this.bookModalVisible = target;
  }
}

export default new ProjectStore();