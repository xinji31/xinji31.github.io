import { Database } from "../db"
import { boxPromise } from "../lib/box"
import { element as e } from "../lib/element"
import { linkTo } from "../lib/router"
import { flatCss } from "../lib/util"
import { loading } from "./loading"

import "semantic-ui-css/components/button.css"
import "semantic-ui-css/components/list.css"
import "semantic-ui-css/components/label.css"

import DateParser from "any-date-parser"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo("en-US")

function articleElement(art) {
  const avatar = author => e("div").attr({
    style: flatCss({
      width: "60px",
      padding: "10px",
    }),
  }).sub(
    e("img").attr({
      src: `https://github.com/${author}.png?size=40`,
      style: flatCss({
        borderRadius: "30px",
        width: "40px",
      }),
    })
  )
  const authorLink = author => e("span").sub(
    e("a").attr({ href: `https://github.com/${author}` }).sub(author),
  )
  const displayTime = t => e("span").sub(timeAgo.format(t)).attr({
    style: "color: grey;",
  })
  const updateLink = art => e("a").sub("update").attr({
    click: linkTo("/publish/article", { shadow: art.hash, title: art.title, tags: art.tags }),
    style: "color: grey; text-decoration: underline;",
  })
  const title = (t, url) => e("h2").sub(t).attr({
    click: linkTo(url),
    style: flatCss({
      marginTop: "10px",
      width: "max",
    })
  })
  const tags = tags => e("div").sub(
    ...tags.map(t => e("div").attr({
      class: "ui label",
      style: flatCss({
        padding: "",
      })
    }).sub(
      t,
    ))
  )
  const infoLine = (author, time, update) => e("div").sub(
    author,
    e("div").attr({ style: "margin-left: auto; color: grey; " }).sub(time, " | ", update),
  ).attr({
    style: flatCss({
      display: "flex",
    })
  })
  const content = (...p) => e("div").sub(...p).attr({
    style: flatCss({
      padding: "10px",
      width: "100%",
    }),
  })

  return e("div").attr({
    class: "ui segment",
    style: flatCss({
      display: "flex",
      minHeight: "120px",
      paddingBottom: "10px",
      marginBottom: "10px",
      borderBottom: "1px solid rgba(34, 36, 38, 0.15)",
    })
  }).sub(
    avatar(art.author),
    content(
      infoLine(
        authorLink(art.author),
        displayTime(DateParser.fromString(art.date)),
        updateLink(art),
      ),
      title(art.title, `/view/article/${art.hash}`),
      tags(art.tags),
    ),
  )
}

/**
 * 
 * @param {Database} db 
 * @returns 
 */
export function articleList(db) {
  return e("div").sub(boxPromise(
    loading(),
    (async () => {
      const si = await db.siteInfo()
      return e("div").sub(
        ...si.previewList.map(id => articleElement(si.articles[id]))
      )
    })()
  ))
}
