export default [{
  type: "folder",
    name: "animals",
      children: [
        {
          type: "folder",
          name: "cat",
          children: [
            {
              type: "folder",
              name: "images",
              children: [
                {
                  type: "file",
                  name: "cat001.jpg"
                }, {
                  type: "file",
                  name: "cat002.jpg"
                }
              ]
            }
          ]
        },
        {
          type: "folder",
          name: "dog",
          children: [
            {
              type: "folder",
              name: "images",
              children: [
                {
                  type: "file",
                  name: "dog001.jpg"
                }, {
                  type: "file",
                  name: "dog002.jpg"
                }
              ]
            }
          ]
        },
        {
          type: "file",
          name: "bear.png"
        },
        {
          type: "file",
          name: "horse.png"
        }
      ]
}];