import React from 'react';
import data from '../data/treeStructure.js'

const Entry = (path, onDeleteFile, {type, name}) => {
  if (type === 'folder') {
    return <div key={name}><a href={`#/${path}${name}/`} key={name}>{name}</a></div>
  } else {
    return <div key={name}><a href='#' onClick={onDeleteFile.bind(this, name)}>🚮</a> {name}</div>
  }
}

export default class App extends React.Component {
  constructor() {
    super();

    this.getContents = this.getContents.bind(this)
    this.onHashChange = this.onHashChange.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.renderSearchResults = this.renderSearchResults.bind(this)
    this.onCreateNewFile = this.onCreateNewFile.bind(this)
    this.onDeleteFile = this.onDeleteFile.bind(this)
    this.renderGoBack = this.renderGoBack.bind(this)
    this.renderContents = this.renderContents.bind(this)
    this.renderNewFile = this.renderNewFile.bind(this)
    
    window.addEventListener('hashchange', this.onHashChange, false);

    this.state = {
      searchResults: [],
      data
    };
  }

  onHashChange() {
    this.forceUpdate();
  }

  getPath() {
    return location.hash.substr(2)
  }

  getContents(data, path) {
    path = path.split('/')
    if (path.length === 1) {
      return data
    } else {
      const folderName = path.shift();
      const folderContents = data.find(entry => entry.name === folderName).children;
      return this.getContents(folderContents, path.join('/'))
    }
  }

  sortContents(a, b) {
    if (a.type === 'folder') {
      if (b.type === 'folder') {
        return a.name < b.name ? -1 : 1;
      } else {
        return -1
      }
    } else {
      if (b.type === 'folder') {
        return 1
      } else {
        return a.name < b.name ? -1 : 1;
      }
    }
  }

  getPrevPath(path) {
    const splitPath = path.split('/');
    splitPath.pop();
    splitPath.pop();
    return splitPath.join('/') + ((splitPath.length === 0) ? '' : '/');
  }

  onSearchChange(e) {
    let searchString = e.currentTarget.value
    let searchResults = [];

    function searchTree(tree, path) {
      tree.forEach(entry => {
        if (entry.name === searchString) {
          searchResults.push(path + entry.name)
        }
        if (entry.type === 'folder') {
          searchTree(entry.children, path + entry.name + '/')
        }
      })
    }

    searchTree(this.state.data, '/')

    this.setState({searchResults});
  }

  onCreateNewFile(e) {
    e.preventDefault();
    const filename = prompt('Enter file name');

    if (filename !== null) {
      const path = this.getPath();
      const contents = this.getContents(this.state.data, path);
      contents.push({
        type: 'file',
        name: filename
      });

      this.setState(this.state);
    }
  }

  onDeleteFile(name, e) {
    e.preventDefault();

    const contents = this.getContents(this.state.data, this.getPath())
    const index = contents.findIndex(entry => entry.name === name);
    contents.splice(index, 1);

    this.setState(this.state);
  }

  renderSearch() {
    return <div>
      <span>Search: </span> <input onChange={this.onSearchChange} type='text'/>
    </div>
  }

  renderSearchResults() {
    return <div>
      {this.state.searchResults.map(result => 
        <div key={result}>{result}</div>)}
    </div>
  }

  renderGoBack(path) {
    return path.length
      ? <div><a href={`#/${this.getPrevPath(path)}`}>..</a></div>
      : null
  }

  renderContents(folderContents, path) {
    return folderContents
      .sort(this.sortContents)
      .map(Entry.bind(this, path, this.onDeleteFile));
  }

  renderNewFile() {
    return <div><a href='#' onClick={this.onCreateNewFile}>+ New File</a></div>
  }

  render() {
    const path = this.getPath();
    const folderContents = this.getContents(this.state.data, this.getPath());

    return (
      <div>
        <h1>{'/' + path}</h1>
        {this.renderSearch()}
        {this.renderSearchResults()}
        <hr />
        {this.renderGoBack(path)}
        {this.renderContents(folderContents, path)}
        {this.renderNewFile()}
      </div>);
  }
}