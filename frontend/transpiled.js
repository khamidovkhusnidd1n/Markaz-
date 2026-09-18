import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/pages/DepartmentPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c2e6c37d"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=c2e6c37d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react;
import { useParams, Link } from "/node_modules/.vite/deps/react-router-dom.js?v=c2e6c37d";
import { ArrowLeft, PlayCircle, Monitor, BookOpen, Cpu, Grid, ChevronDown, ChevronLeft, ChevronRight } from "/node_modules/.vite/deps/lucide-react.js?v=c2e6c37d";
import { useTranslation } from "/node_modules/.vite/deps/react-i18next.js?v=c2e6c37d";
import { NewsModal } from "/components/NewsModal.tsx";
import { ImageModal } from "/components/ImageModal.tsx";
import { useApp } from "/context/AppContext.tsx";
const DepartmentPage = () => {
  _s();
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { departments } = useApp();
  const getLocalizedField = (obj, field) => {
    if (!obj) return "";
    const lang = i18n.language?.substring(0, 2);
    if (lang === "ru" && obj[`${field}_ru`]) return obj[`${field}_ru`];
    if (lang === "en" && obj[`${field}_en`]) return obj[`${field}_en`];
    return obj[field] || "";
  };
  const getIcon = (iconName) => {
    switch (iconName) {
      case "Monitor":
        return /* @__PURE__ */ jsxDEV(Monitor, { size: 22 }, void 0, false, {
          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
          lineNumber: 25,
          columnNumber: 29
        }, this);
      case "BookOpen":
        return /* @__PURE__ */ jsxDEV(BookOpen, { size: 22 }, void 0, false, {
          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
          lineNumber: 26,
          columnNumber: 30
        }, this);
      case "Cpu":
        return /* @__PURE__ */ jsxDEV(Cpu, { size: 22 }, void 0, false, {
          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
          lineNumber: 27,
          columnNumber: 25
        }, this);
      default:
        return /* @__PURE__ */ jsxDEV(Grid, { size: 22 }, void 0, false, {
          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
          lineNumber: 28,
          columnNumber: 22
        }, this);
    }
  };
  const dept = departments?.find((d) => d.id.toString() === slug) || null;
  const [openSectionIdx, setOpenSectionIdx] = React.useState(0);
  const [currentImgIdx, setCurrentImgIdx] = React.useState(0);
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [zoomedImage, setZoomedImage] = React.useState(null);
  React.useEffect(() => {
    setOpenSectionIdx(0);
    setCurrentImgIdx(0);
  }, [slug]);
  console.log("DEPARTMENT:", dept?.name, "POSTS:", dept?.department_posts);
  if (!dept) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-700 mb-4", children: t("departments.no_departments") }, void 0, false, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 50,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Link, { to: "/", className: "text-blue-600 hover:underline", children: t("departments.back") }, void 0, false, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 51,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
      lineNumber: 49,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
      lineNumber: 48,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50", children: [
    /* @__PURE__ */ jsxDEV("div", { className: `bg-gradient-to-r ${dept.color_classes || "from-blue-900 to-blue-700"} text-white py-16`, children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxDEV(Link, { to: "/", className: "inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm", children: [
        /* @__PURE__ */ jsxDEV(ArrowLeft, { size: 16 }, void 0, false, {
          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
          lineNumber: 63,
          columnNumber: 13
        }, this),
        " ",
        t("departments.back")
      ] }, void 0, true, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 62,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 mb-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm", children: getIcon(dept.icon_name || "") }, void 0, false, {
          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
          lineNumber: 66,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl md:text-4xl font-bold", children: getLocalizedField(dept, "name") }, void 0, false, {
          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
          lineNumber: 69,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 65,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-white/80 text-lg max-w-3xl leading-relaxed", children: getLocalizedField(dept, "description") }, void 0, false, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 71,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
      lineNumber: 61,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 py-12", children: [
      /* @__PURE__ */ jsxDEV("div", { style: { backgroundColor: "red", padding: "40px", margin: "40px 0", color: "white", fontSize: "30px", fontWeight: "bold", textAlign: "center", borderRadius: "10px" }, children: [
        "TEST: QILINGAN ISHLAR YUKLANDI! (POSTLAR SONI: ",
        dept.department_posts ? dept.department_posts.length : "YOQ",
        ")"
      ] }, void 0, true, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 79,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl shadow-lg overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "p-8", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-bold text-gray-800 mb-6", children: t("departments.main_tasks") }, void 0, false, {
          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
          lineNumber: 85,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: dept.department_tasks && dept.department_tasks.length > 0 ? [...dept.department_tasks].sort((a, b) => a.order - b.order).map((taskObj, idx) => {
          const taskText = getLocalizedField(taskObj, "task_text");
          if (!taskText.trim()) return null;
          return /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all duration-300 group border border-gray-100",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: `w-8 h-8 bg-gradient-to-r ${dept.color_classes || "from-blue-600 to-blue-800"} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform`, children: idx + 1 }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 96,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "text-gray-700 leading-relaxed font-medium prose prose-sm max-w-none", dangerouslySetInnerHTML: { __html: taskText } }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 99,
                  columnNumber: 23
                }, this)
              ]
            },
            taskObj.id,
            true,
            {
              fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
              lineNumber: 92,
              columnNumber: 19
            },
            this
          );
        }) : getLocalizedField(dept, "tasks").split(/\r?\n/).map((task, idx) => {
          if (!task.trim()) return null;
          return /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all duration-300 group border border-gray-100",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: `w-8 h-8 bg-gradient-to-r ${dept.color_classes || "from-blue-600 to-blue-800"} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform`, children: idx + 1 }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 111,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "text-gray-700 leading-relaxed font-medium prose prose-sm max-w-none", dangerouslySetInnerHTML: { __html: task } }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 114,
                  columnNumber: 23
                }, this)
              ]
            },
            idx,
            true,
            {
              fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
              lineNumber: 107,
              columnNumber: 19
            },
            this
          );
        }) }, void 0, false, {
          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
          lineNumber: 86,
          columnNumber: 13
        }, this),
        (() => {
          const target = typeof dept !== "undefined" ? dept : currentTab;
          const detailText = getLocalizedField(target, "detail_text");
          const allImages = [];
          if (target.images && target.images.length > 0) {
            [...target.images].sort((a, b) => a.order - b.order).forEach((img) => {
              if (img.image_url) allImages.push(img.image_url);
            });
          }
          const allVideos = [];
          if (target.videos && target.videos.length > 0) {
            [...target.videos].sort((a, b) => a.order - b.order).forEach((v) => {
              if (v.video_url) allVideos.push(v.video_url);
            });
          }
          const hasMedia = allImages.length > 0 || allVideos.length > 0;
          if (!hasMedia && !detailText) return null;
          return /* @__PURE__ */ jsxDEV("div", { className: "mt-10 pt-10 border-t border-gray-100", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold text-gray-800 mb-6", children: "Batafsil ma'lumot" }, void 0, false, {
              fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
              lineNumber: 149,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: hasMedia ? "grid grid-cols-1 lg:grid-cols-5 gap-8 items-start" : "w-full", children: [
              /* @__PURE__ */ jsxDEV("div", { className: hasMedia ? "lg:col-span-3 space-y-4" : "w-full", children: [
                detailText && /* @__PURE__ */ jsxDEV("div", { className: "prose prose-blue max-w-none text-gray-700 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm", dangerouslySetInnerHTML: { __html: detailText } }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 155,
                  columnNumber: 23
                }, this),
                dept.department_tasks && dept.department_tasks.filter((t2) => getLocalizedField(t2, "title")).length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-4", children: [...dept.department_tasks].filter((t2) => getLocalizedField(t2, "title")).sort((a, b) => a.order - b.order).map((task, idx) => {
                  const isOpen = openSectionIdx === idx;
                  return /* @__PURE__ */ jsxDEV("div", { className: "rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-300 bg-white h-fit", children: [
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => setOpenSectionIdx(isOpen ? null : idx),
                        className: `w-full text-left p-5 font-bold text-base md:text-lg flex justify-between items-center transition-colors duration-300 gap-4 ${isOpen ? "bg-blue-50/75 text-blue-900 border-b border-blue-100/50" : "bg-white text-slate-800 hover:bg-slate-50"}`,
                        children: [
                          /* @__PURE__ */ jsxDEV("span", { children: getLocalizedField(task, "title") }, void 0, false, {
                            fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                            lineNumber: 172,
                            columnNumber: 35
                          }, this),
                          /* @__PURE__ */ jsxDEV("span", { className: `transform transition-transform duration-300 text-blue-600 shrink-0 ${isOpen ? "rotate-180" : ""}`, children: /* @__PURE__ */ jsxDEV(ChevronDown, { size: 20 }, void 0, false, {
                            fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                            lineNumber: 174,
                            columnNumber: 37
                          }, this) }, void 0, false, {
                            fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                            lineNumber: 173,
                            columnNumber: 35
                          }, this)
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                        lineNumber: 164,
                        columnNumber: 33
                      },
                      this
                    ),
                    isOpen && /* @__PURE__ */ jsxDEV("div", { className: "p-6 bg-white prose prose-blue max-w-none text-slate-600 leading-relaxed font-normal", children: /* @__PURE__ */ jsxDEV("div", { dangerouslySetInnerHTML: { __html: getLocalizedField(task, "task_text") } }, void 0, false, {
                      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                      lineNumber: 179,
                      columnNumber: 37
                    }, this) }, void 0, false, {
                      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                      lineNumber: 178,
                      columnNumber: 31
                    }, this)
                  ] }, task.id, true, {
                    fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                    lineNumber: 163,
                    columnNumber: 29
                  }, this);
                }) }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 159,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                lineNumber: 153,
                columnNumber: 21
              }, this),
              hasMedia && /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2 space-y-6 w-full max-w-md mx-auto", children: [
                allImages.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-slate-50 p-2 flex items-center justify-center aspect-video lg:aspect-[4/3] w-full", children: [
                  /* @__PURE__ */ jsxDEV(
                    "img",
                    {
                      src: allImages[currentImgIdx],
                      alt: `${getLocalizedField(target, "name")} - ${currentImgIdx + 1}`,
                      className: "max-w-full max-h-full object-contain rounded-xl transition-all duration-500"
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                      lineNumber: 194,
                      columnNumber: 29
                    },
                    this
                  ),
                  allImages.length > 1 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          setCurrentImgIdx((prev) => prev === 0 ? allImages.length - 1 : prev - 1);
                        },
                        className: "absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                        children: /* @__PURE__ */ jsxDEV(ChevronLeft, { size: 18 }, void 0, false, {
                          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                          lineNumber: 205,
                          columnNumber: 35
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                        lineNumber: 201,
                        columnNumber: 33
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          setCurrentImgIdx((prev) => prev === allImages.length - 1 ? 0 : prev + 1);
                        },
                        className: "absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                        children: /* @__PURE__ */ jsxDEV(ChevronRight, { size: 18 }, void 0, false, {
                          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                          lineNumber: 211,
                          columnNumber: 35
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                        lineNumber: 207,
                        columnNumber: 33
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/35 px-2.5 py-1 rounded-full backdrop-blur-sm", children: allImages.map(
                      (_, i) => /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => setCurrentImgIdx(i),
                          className: `w-1.5 h-1.5 rounded-full transition-all ${currentImgIdx === i ? "bg-white w-3" : "bg-white/50"}`
                        },
                        i,
                        false,
                        {
                          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                          lineNumber: 215,
                          columnNumber: 29
                        },
                        this
                      )
                    ) }, void 0, false, {
                      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                      lineNumber: 213,
                      columnNumber: 33
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                    lineNumber: 200,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 193,
                  columnNumber: 23
                }, this),
                allVideos.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-4", children: allVideos.map(
                  (videoUrl, i) => /* @__PURE__ */ jsxDEV(
                    "a",
                    {
                      href: videoUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "group block relative rounded-2xl overflow-hidden shadow-md bg-gray-900 aspect-video flex items-center justify-center border border-gray-100",
                      children: [
                        /* @__PURE__ */ jsxDEV(
                          "img",
                          {
                            src: allImages[0] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
                            alt: `Video thumbnail - ${i + 1}`,
                            className: "absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
                          },
                          void 0,
                          false,
                          {
                            fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                            lineNumber: 237,
                            columnNumber: 33
                          },
                          this
                        ),
                        /* @__PURE__ */ jsxDEV(PlayCircle, { size: 56, className: "text-white relative z-10 group-hover:scale-110 transition-transform shadow-sm" }, void 0, false, {
                          fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                          lineNumber: 242,
                          columnNumber: 33
                        }, this)
                      ]
                    },
                    i,
                    true,
                    {
                      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                      lineNumber: 230,
                      columnNumber: 25
                    },
                    this
                  )
                ) }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 228,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                lineNumber: 191,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
              lineNumber: 150,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
            lineNumber: 148,
            columnNumber: 17
          }, this);
        })()
      ] }, void 0, true, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 84,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 83,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
      lineNumber: 78,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      ImageModal,
      {
        images: zoomedImage ? [zoomedImage] : [],
        initialIndex: 0,
        isOpen: !!zoomedImage,
        onClose: () => setZoomedImage(null)
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 256,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("section", { className: "container mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "mb-8 border-l-4 border-blue-600 pl-4", children: /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-slate-800 uppercase tracking-wide", children: "Qilingan ishlar / Hamkorliklar" }, void 0, false, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 269,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 268,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: dept.department_posts.map(
        (post) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setSelectedPost({
              id: post.id,
              title: getLocalizedField(post, "title"),
              date: post.date,
              content: getLocalizedField(post, "content"),
              image: post.image || null,
              images: post.image ? [{ id: 1, imageUrl: post.image }] : []
            }),
            className: "group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl text-left flex flex-col",
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "h-40 overflow-hidden bg-slate-200 w-full relative", children: post.image ? /* @__PURE__ */ jsxDEV(
                "img",
                {
                  src: post.image,
                  alt: getLocalizedField(post, "title"),
                  className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 287,
                  columnNumber: 15
                },
                this
              ) : /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full bg-slate-100 flex items-center justify-center text-slate-400", children: "Rasm yo'q" }, void 0, false, {
                fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                lineNumber: 293,
                columnNumber: 15
              }, this) }, void 0, false, {
                fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                lineNumber: 285,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "p-6 flex-1 flex flex-col", children: [
                /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-slate-400 mb-2", children: post.date }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 297,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold text-slate-900 group-hover:text-blue-700 line-clamp-2", children: getLocalizedField(post, "title") }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 298,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: "mt-3 text-sm text-slate-600 line-clamp-3 flex-1 prose prose-sm",
                    dangerouslySetInnerHTML: { __html: getLocalizedField(post, "content") }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                    lineNumber: 301,
                    columnNumber: 19
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "mt-4 font-bold text-blue-600 text-sm", children: "Batafsil o'qish →" }, void 0, false, {
                  fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                  lineNumber: 303,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
                lineNumber: 296,
                columnNumber: 17
              }, this)
            ]
          },
          post.id,
          true,
          {
            fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
            lineNumber: 273,
            columnNumber: 11
          },
          this
        )
      ) }, void 0, false, {
        fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
        lineNumber: 271,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
      lineNumber: 267,
      columnNumber: 7
    }, this),
    selectedPost && /* @__PURE__ */ jsxDEV(NewsModal, { item: selectedPost, onClose: () => setSelectedPost(null) }, void 0, false, {
      fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
      lineNumber: 314,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
    lineNumber: 58,
    columnNumber: 5
  }, this);
};
_s(DepartmentPage, "1EEZrR2pWL+Hq82tEJf6Zw5KMXc=", false, function() {
  return [useParams, useTranslation, useApp];
});
_c = DepartmentPage;
export default DepartmentPage;
var _c;
$RefreshReg$(_c, "DepartmentPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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IkJvb2tPcGVuIiwiQ3B1IiwiR3JpZCIsIkNoZXZyb25Eb3duIiwiQ2hldnJvbkxlZnQiLCJDaGV2cm9uUmlnaHQiLCJ1c2VUcmFuc2xhdGlvbiIsIk5ld3NNb2RhbCIsIkltYWdlTW9kYWwiLCJ1c2VBcHAiLCJEZXBhcnRtZW50UGFnZSIsIl9zIiwic2x1ZyIsInQiLCJpMThuIiwiZGVwYXJ0bWVudHMiLCJnZXRMb2NhbGl6ZWRGaWVsZCIsIm9iaiIsImZpZWxkIiwibGFuZyIsImxhbmd1YWdlIiwic3Vic3RyaW5nIiwiZ2V0SWNvbiIsImljb25OYW1lIiwiZGVwdCIsImZpbmQiLCJkIiwiaWQiLCJ0b1N0cmluZyIsIm9wZW5TZWN0aW9uSWR4Iiwic2V0T3BlblNlY3Rpb25JZHgiLCJ1c2VTdGF0ZSIsImN1cnJlbnRJbWdJZHgiLCJzZXRDdXJyZW50SW1nSWR4Iiwic2VsZWN0ZWRQb3N0Iiwic2V0U2VsZWN0ZWRQb3N0Iiwiem9vbWVkSW1hZ2UiLCJzZXRab29tZWRJbWFnZSIsInVzZUVmZmVjdCIsImNvbnNvbGUiLCJsb2ciLCJuYW1lIiwiZGVwYXJ0bWVudF9wb3N0cyIsImNvbG9yX2NsYXNzZXMiLCJpY29uX25hbWUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwYWRkaW5nIiwibWFyZ2luIiwiY29sb3IiLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJsZW5ndGgiLCJkZXBhcnRtZW50X3Rhc2tzIiwic29ydCIsImEiLCJiIiwib3JkZXIiLCJtYXAiLCJ0YXNrT2JqIiwiaWR4IiwidGFza1RleHQiLCJ0cmltIiwiX19odG1sIiwic3BsaXQiLCJ0YXNrIiwidGFyZ2V0IiwiY3VycmVudFRhYiIsImRldGFpbFRleHQiLCJhbGxJbWFnZXMiLCJpbWFnZXMiLCJmb3JFYWNoIiwiaW1nIiwiaW1hZ2VfdXJsIiwicHVzaCIsImFsbFZpZGVvcyIsInZpZGVvcyIsInYiLCJ2aWRlb191cmwiLCJoYXNNZWRpYSIsImZpbHRlciIsImlzT3BlbiIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2IiwiXyIsImkiLCJ2aWRlb1VybCIsInBvc3QiLCJ0aXRsZSIsImRhdGUiLCJjb250ZW50IiwiaW1hZ2UiLCJpbWFnZVVybCIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkRlcGFydG1lbnRQYWdlLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VQYXJhbXMsIExpbmssIE5hdmlnYXRlIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7IEFycm93TGVmdCwgUGxheUNpcmNsZSwgTW9uaXRvciwgQm9va09wZW4sIENwdSwgR3JpZCwgQ2hldnJvbkRvd24sIENoZXZyb25MZWZ0LCBDaGV2cm9uUmlnaHQgfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xyXG5pbXBvcnQgeyBOZXdzTW9kYWwgfSBmcm9tICcuLi9jb21wb25lbnRzL05ld3NNb2RhbCc7XHJcbmltcG9ydCB7IEltYWdlTW9kYWwgfSBmcm9tICcuLi9jb21wb25lbnRzL0ltYWdlTW9kYWwnO1xyXG5pbXBvcnQgeyB1c2VBcHAgfSBmcm9tICcuLi9jb250ZXh0L0FwcENvbnRleHQnO1xyXG5pbXBvcnQgeyBnZXRJbWFnZVVybCB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmNvbnN0IERlcGFydG1lbnRQYWdlOiBSZWFjdC5GQyA9ICgpID0+IHtcclxuICBjb25zdCB7IHNsdWcgfSA9IHVzZVBhcmFtczx7IHNsdWc6IHN0cmluZyB9PigpO1xyXG4gIGNvbnN0IHsgdCwgaTE4biB9ID0gdXNlVHJhbnNsYXRpb24oKTtcclxuICBjb25zdCB7IGRlcGFydG1lbnRzIH0gPSB1c2VBcHAoKTtcclxuXHJcbiAgY29uc3QgZ2V0TG9jYWxpemVkRmllbGQgPSAob2JqOiBhbnksIGZpZWxkOiBzdHJpbmcpID0+IHtcclxuICAgIGlmICghb2JqKSByZXR1cm4gJyc7XHJcbiAgICBjb25zdCBsYW5nID0gaTE4bi5sYW5ndWFnZT8uc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgaWYgKGxhbmcgPT09ICdydScgJiYgb2JqW2Ake2ZpZWxkfV9ydWBdKSByZXR1cm4gb2JqW2Ake2ZpZWxkfV9ydWBdO1xyXG4gICAgaWYgKGxhbmcgPT09ICdlbicgJiYgb2JqW2Ake2ZpZWxkfV9lbmBdKSByZXR1cm4gb2JqW2Ake2ZpZWxkfV9lbmBdO1xyXG4gICAgcmV0dXJuIG9ialtmaWVsZF0gfHwgJyc7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ2V0SWNvbiA9IChpY29uTmFtZTogc3RyaW5nKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGljb25OYW1lKSB7XHJcbiAgICAgIGNhc2UgJ01vbml0b3InOiByZXR1cm4gPE1vbml0b3Igc2l6ZT17MjJ9IC8+O1xyXG4gICAgICBjYXNlICdCb29rT3Blbic6IHJldHVybiA8Qm9va09wZW4gc2l6ZT17MjJ9IC8+O1xyXG4gICAgICBjYXNlICdDcHUnOiByZXR1cm4gPENwdSBzaXplPXsyMn0gLz47XHJcbiAgICAgIGRlZmF1bHQ6IHJldHVybiA8R3JpZCBzaXplPXsyMn0gLz47XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZGVwdCA9IGRlcGFydG1lbnRzPy5maW5kKGQgPT4gZC5pZC50b1N0cmluZygpID09PSBzbHVnKSB8fCBudWxsO1xyXG5cclxuICBjb25zdCBbb3BlblNlY3Rpb25JZHgsIHNldE9wZW5TZWN0aW9uSWR4XSA9IFJlYWN0LnVzZVN0YXRlPG51bWJlciB8IG51bGw+KDApO1xyXG4gIGNvbnN0IFtjdXJyZW50SW1nSWR4LCBzZXRDdXJyZW50SW1nSWR4XSA9IFJlYWN0LnVzZVN0YXRlPG51bWJlcj4oMCk7XHJcbiAgICBjb25zdCBbc2VsZWN0ZWRQb3N0LCBzZXRTZWxlY3RlZFBvc3RdID0gUmVhY3QudXNlU3RhdGU8YW55IHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW3pvb21lZEltYWdlLCBzZXRab29tZWRJbWFnZV0gPSBSZWFjdC51c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuXHJcblxyXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRPcGVuU2VjdGlvbklkeCgwKTtcclxuICAgIHNldEN1cnJlbnRJbWdJZHgoMCk7XHJcbiAgfSwgW3NsdWddKTtcclxuXHJcbiAgY29uc29sZS5sb2coJ0RFUEFSVE1FTlQ6JywgZGVwdD8ubmFtZSwgJ1BPU1RTOicsIGRlcHQ/LmRlcGFydG1lbnRfcG9zdHMpO1xyXG4gIGlmICghZGVwdCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gYmctZ3JhZGllbnQtdG8tYnIgZnJvbS1zbGF0ZS01MCB0by1ibHVlLTUwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LWdyYXktNzAwIG1iLTRcIj57dCgnZGVwYXJ0bWVudHMubm9fZGVwYXJ0bWVudHMnKX08L2gyPlxyXG4gICAgICAgICAgPExpbmsgdG89XCIvXCIgY2xhc3NOYW1lPVwidGV4dC1ibHVlLTYwMCBob3Zlcjp1bmRlcmxpbmVcIj57dCgnZGVwYXJ0bWVudHMuYmFjaycpfTwvTGluaz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLWdyYWRpZW50LXRvLWJyIGZyb20tc2xhdGUtNTAgdG8tYmx1ZS01MFwiPlxyXG4gICAgICB7LyogSGVybyAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BiZy1ncmFkaWVudC10by1yICR7ZGVwdC5jb2xvcl9jbGFzc2VzIHx8ICdmcm9tLWJsdWUtOTAwIHRvLWJsdWUtNzAwJ30gdGV4dC13aGl0ZSBweS0xNmB9PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyIG14LWF1dG8gcHgtNFwiPlxyXG4gICAgICAgICAgPExpbmsgdG89XCIvXCIgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtd2hpdGUvNzAgaG92ZXI6dGV4dC13aGl0ZSBtYi02IHRyYW5zaXRpb24tY29sb3JzIHRleHQtc21cIj5cclxuICAgICAgICAgICAgPEFycm93TGVmdCBzaXplPXsxNn0gLz4ge3QoJ2RlcGFydG1lbnRzLmJhY2snKX1cclxuICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTQgbWItNFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTYgaC0xNiBiZy13aGl0ZS8yMCByb3VuZGVkLTJ4bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiYWNrZHJvcC1ibHVyLXNtXCI+XHJcbiAgICAgICAgICAgICAge2dldEljb24oZGVwdC5pY29uX25hbWUgfHwgJycpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtM3hsIG1kOnRleHQtNHhsIGZvbnQtYm9sZFwiPntnZXRMb2NhbGl6ZWRGaWVsZChkZXB0LCAnbmFtZScpfTwvaDE+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtd2hpdGUvODAgdGV4dC1sZyBtYXgtdy0zeGwgbGVhZGluZy1yZWxheGVkXCI+XHJcbiAgICAgICAgICAgIHtnZXRMb2NhbGl6ZWRGaWVsZChkZXB0LCAnZGVzY3JpcHRpb24nKX1cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7LyogQ29udGVudCAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgbXgtYXV0byBweC00IHB5LTEyXCI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnLCBwYWRkaW5nOiAnNDBweCcsIG1hcmdpbjogJzQwcHggMCcsIGNvbG9yOiAnd2hpdGUnLCBmb250U2l6ZTogJzMwcHgnLCBmb250V2VpZ2h0OiAnYm9sZCcsIHRleHRBbGlnbjogJ2NlbnRlcicsIGJvcmRlclJhZGl1czogJzEwcHgnIH19PlxyXG4gICAgICAgICAgVEVTVDogUUlMSU5HQU4gSVNITEFSIFlVS0xBTkRJISAoUE9TVExBUiBTT05JOiB7ZGVwdC5kZXBhcnRtZW50X3Bvc3RzID8gZGVwdC5kZXBhcnRtZW50X3Bvc3RzLmxlbmd0aCA6ICdZT1EnfSlcclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSByb3VuZGVkLTJ4bCBzaGFkb3ctbGcgb3ZlcmZsb3ctaGlkZGVuXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtOFwiPlxyXG4gICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC14bCBmb250LWJvbGQgdGV4dC1ncmF5LTgwMCBtYi02XCI+e3QoJ2RlcGFydG1lbnRzLm1haW5fdGFza3MnKX08L2gyPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTRcIj5cclxuICAgICAgICAgICAgICB7ZGVwdC5kZXBhcnRtZW50X3Rhc2tzICYmIGRlcHQuZGVwYXJ0bWVudF90YXNrcy5sZW5ndGggPiAwID8gKFxyXG4gICAgICAgICAgICAgICAgWy4uLmRlcHQuZGVwYXJ0bWVudF90YXNrc10uc29ydCgoYSwgYikgPT4gYS5vcmRlciAtIGIub3JkZXIpLm1hcCgodGFza09iaiwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tUZXh0ID0gZ2V0TG9jYWxpemVkRmllbGQodGFza09iaiwgJ3Rhc2tfdGV4dCcpO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoIXRhc2tUZXh0LnRyaW0oKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgICAga2V5PXt0YXNrT2JqLmlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBnYXAtNCBwLTUgYmctZ3JheS01MCByb3VuZGVkLXhsIGhvdmVyOmJnLWJsdWUtNTAgaG92ZXI6c2hhZG93LXNtIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCBncm91cCBib3JkZXIgYm9yZGVyLWdyYXktMTAwXCJcclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHctOCBoLTggYmctZ3JhZGllbnQtdG8tciAke2RlcHQuY29sb3JfY2xhc3NlcyB8fCAnZnJvbS1ibHVlLTYwMCB0by1ibHVlLTgwMCd9IHJvdW5kZWQtbGcgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC13aGl0ZSBmb250LWJvbGQgdGV4dC1zbSBzaHJpbmstMCBncm91cC1ob3ZlcjpzY2FsZS0xMTAgdHJhbnNpdGlvbi10cmFuc2Zvcm1gfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2lkeCArIDF9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTcwMCBsZWFkaW5nLXJlbGF4ZWQgZm9udC1tZWRpdW0gcHJvc2UgcHJvc2Utc20gbWF4LXctbm9uZVwiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogdGFza1RleHQgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIGdldExvY2FsaXplZEZpZWxkKGRlcHQsICd0YXNrcycpLnNwbGl0KC9cXHI/XFxuLykubWFwKCh0YXNrOiBzdHJpbmcsIGlkeDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICghdGFzay50cmltKCkpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgIGtleT17aWR4fVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBnYXAtNCBwLTUgYmctZ3JheS01MCByb3VuZGVkLXhsIGhvdmVyOmJnLWJsdWUtNTAgaG92ZXI6c2hhZG93LXNtIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCBncm91cCBib3JkZXIgYm9yZGVyLWdyYXktMTAwXCJcclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHctOCBoLTggYmctZ3JhZGllbnQtdG8tciAke2RlcHQuY29sb3JfY2xhc3NlcyB8fCAnZnJvbS1ibHVlLTYwMCB0by1ibHVlLTgwMCd9IHJvdW5kZWQtbGcgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC13aGl0ZSBmb250LWJvbGQgdGV4dC1zbSBzaHJpbmstMCBncm91cC1ob3ZlcjpzY2FsZS0xMTAgdHJhbnNpdGlvbi10cmFuc2Zvcm1gfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2lkeCArIDF9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTcwMCBsZWFkaW5nLXJlbGF4ZWQgZm9udC1tZWRpdW0gcHJvc2UgcHJvc2Utc20gbWF4LXctbm9uZVwiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogdGFzayB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBEZXRhaWxlZCBJbmZvICovfVxyXG4gICAgICAgICAgICB7KCgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0eXBlb2YgZGVwdCAhPT0gJ3VuZGVmaW5lZCcgPyBkZXB0IDogY3VycmVudFRhYjtcclxuICAgICAgICAgICAgICBjb25zdCBkZXRhaWxUZXh0ID0gZ2V0TG9jYWxpemVkRmllbGQodGFyZ2V0LCAnZGV0YWlsX3RleHQnKTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAvLyBHYXRoZXIgYWxsIGltYWdlc1xyXG4gICAgICAgICAgICAgIGNvbnN0IGFsbEltYWdlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgICBpZiAodGFyZ2V0LmltYWdlcyAmJiB0YXJnZXQuaW1hZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIFsuLi50YXJnZXQuaW1hZ2VzXS5zb3J0KChhLCBiKSA9PiBhLm9yZGVyIC0gYi5vcmRlcikuZm9yRWFjaCgoaW1nOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGltZy5pbWFnZV91cmwpIGFsbEltYWdlcy5wdXNoKGltZy5pbWFnZV91cmwpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBHYXRoZXIgYWxsIHZpZGVvc1xyXG4gICAgICAgICAgICAgIGNvbnN0IGFsbFZpZGVvczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgICBpZiAodGFyZ2V0LnZpZGVvcyAmJiB0YXJnZXQudmlkZW9zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIFsuLi50YXJnZXQudmlkZW9zXS5zb3J0KChhLCBiKSA9PiBhLm9yZGVyIC0gYi5vcmRlcikuZm9yRWFjaCgodjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh2LnZpZGVvX3VybCkgYWxsVmlkZW9zLnB1c2godi52aWRlb191cmwpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgaGFzTWVkaWEgPSBhbGxJbWFnZXMubGVuZ3RoID4gMCB8fCBhbGxWaWRlb3MubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKCFoYXNNZWRpYSAmJiAhZGV0YWlsVGV4dCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTEwIHB0LTEwIGJvcmRlci10IGJvcmRlci1ncmF5LTEwMFwiPlxyXG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC14bCBmb250LWJvbGQgdGV4dC1ncmF5LTgwMCBtYi02XCI+QmF0YWZzaWwgbWEnbHVtb3Q8L2gzPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17aGFzTWVkaWEgPyBcImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLTUgZ2FwLTggaXRlbXMtc3RhcnRcIiA6IFwidy1mdWxsXCJ9PlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBEZXRhaWwgVGV4dCAmIEFjY29yZGlvbiAqL31cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17aGFzTWVkaWEgPyBcImxnOmNvbC1zcGFuLTMgc3BhY2UteS00XCIgOiBcInctZnVsbFwifT5cclxuICAgICAgICAgICAgICAgICAgICAgIHtkZXRhaWxUZXh0ICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9zZSBwcm9zZS1ibHVlIG1heC13LW5vbmUgdGV4dC1ncmF5LTcwMCBtYi04IGJnLXdoaXRlIHAtNiByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWdyYXktMTAwIHNoYWRvdy1zbVwiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogZGV0YWlsVGV4dCB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICB7ZGVwdC5kZXBhcnRtZW50X3Rhc2tzICYmIGRlcHQuZGVwYXJ0bWVudF90YXNrcy5maWx0ZXIoKHQ6IGFueSkgPT4gZ2V0TG9jYWxpemVkRmllbGQodCwgJ3RpdGxlJykpLmxlbmd0aCA+IDAgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgZ2FwLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7Wy4uLmRlcHQuZGVwYXJ0bWVudF90YXNrc10uZmlsdGVyKCh0OiBhbnkpID0+IGdldExvY2FsaXplZEZpZWxkKHQsICd0aXRsZScpKS5zb3J0KChhOiBhbnksIGI6IGFueSkgPT4gYS5vcmRlciAtIGIub3JkZXIpLm1hcCgodGFzazogYW55LCBpZHg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNPcGVuID0gb3BlblNlY3Rpb25JZHggPT09IGlkeDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXt0YXNrLmlkfSBjbGFzc05hbWU9XCJyb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWdyYXktMTAwIG92ZXJmbG93LWhpZGRlbiBzaGFkb3ctc20gdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwIGJnLXdoaXRlIGgtZml0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3BlblNlY3Rpb25JZHgoaXNPcGVuID8gbnVsbCA6IGlkeCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgdGV4dC1sZWZ0IHAtNSBmb250LWJvbGQgdGV4dC1iYXNlIG1kOnRleHQtbGcgZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTMwMCBnYXAtNCAke1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09wZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1ibHVlLTUwLzc1IHRleHQtYmx1ZS05MDAgYm9yZGVyLWIgYm9yZGVyLWJsdWUtMTAwLzUwJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXdoaXRlIHRleHQtc2xhdGUtODAwIGhvdmVyOmJnLXNsYXRlLTUwJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2dldExvY2FsaXplZEZpZWxkKHRhc2ssICd0aXRsZScpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRyYW5zZm9ybSB0cmFuc2l0aW9uLXRyYW5zZm9ybSBkdXJhdGlvbi0zMDAgdGV4dC1ibHVlLTYwMCBzaHJpbmstMCAke2lzT3BlbiA/ICdyb3RhdGUtMTgwJyA6ICcnfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q2hldnJvbkRvd24gc2l6ZT17MjB9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzT3BlbiAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNiBiZy13aGl0ZSBwcm9zZSBwcm9zZS1ibHVlIG1heC13LW5vbmUgdGV4dC1zbGF0ZS02MDAgbGVhZGluZy1yZWxheGVkIGZvbnQtbm9ybWFsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBnZXRMb2NhbGl6ZWRGaWVsZCh0YXNrLCAndGFza190ZXh0JykgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogTWVkaWEgUmlnaHQgQ29sdW1uICovfVxyXG4gICAgICAgICAgICAgICAgICAgIHtoYXNNZWRpYSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxnOmNvbC1zcGFuLTIgc3BhY2UteS02IHctZnVsbCBtYXgtdy1tZCBteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHthbGxJbWFnZXMubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBncm91cCByb3VuZGVkLTJ4bCBvdmVyZmxvdy1oaWRkZW4gc2hhZG93LXNtIGJvcmRlciBib3JkZXItZ3JheS0xMDAgYmctc2xhdGUtNTAgcC0yIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGFzcGVjdC12aWRlbyBsZzphc3BlY3QtWzQvM10gdy1mdWxsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17YWxsSW1hZ2VzW2N1cnJlbnRJbWdJZHhdfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e2Ake2dldExvY2FsaXplZEZpZWxkKHRhcmdldCwgJ25hbWUnKX0gLSAke2N1cnJlbnRJbWdJZHggKyAxfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1heC13LWZ1bGwgbWF4LWgtZnVsbCBvYmplY3QtY29udGFpbiByb3VuZGVkLXhsIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTUwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2FsbEltYWdlcy5sZW5ndGggPiAxICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgc2V0Q3VycmVudEltZ0lkeChwcmV2ID0+IChwcmV2ID09PSAwID8gYWxsSW1hZ2VzLmxlbmd0aCAtIDEgOiBwcmV2IC0gMSkpOyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC00IHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB3LTkgaC05IHJvdW5kZWQtZnVsbCBiZy13aGl0ZS85MCBob3ZlcjpiZy13aGl0ZSB0ZXh0LXNsYXRlLTgwMCBzaGFkb3ctbWQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgb3BhY2l0eS0wIGdyb3VwLWhvdmVyOm9wYWNpdHktMTAwIHRyYW5zaXRpb24tb3BhY2l0eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25MZWZ0IHNpemU9ezE4fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBzZXRDdXJyZW50SW1nSWR4KHByZXYgPT4gKHByZXYgPT09IGFsbEltYWdlcy5sZW5ndGggLSAxID8gMCA6IHByZXYgKyAxKSk7IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC00IHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB3LTkgaC05IHJvdW5kZWQtZnVsbCBiZy13aGl0ZS85MCBob3ZlcjpiZy13aGl0ZSB0ZXh0LXNsYXRlLTgwMCBzaGFkb3ctbWQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgb3BhY2l0eS0wIGdyb3VwLWhvdmVyOm9wYWNpdHktMTAwIHRyYW5zaXRpb24tb3BhY2l0eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25SaWdodCBzaXplPXsxOH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS00IGxlZnQtMS8yIC10cmFuc2xhdGUteC0xLzIgZmxleCBnYXAtMS41IGJnLWJsYWNrLzM1IHB4LTIuNSBweS0xIHJvdW5kZWQtZnVsbCBiYWNrZHJvcC1ibHVyLXNtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWxsSW1hZ2VzLm1hcCgoXywgaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEN1cnJlbnRJbWdJZHgoaSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy0xLjUgaC0xLjUgcm91bmRlZC1mdWxsIHRyYW5zaXRpb24tYWxsICR7Y3VycmVudEltZ0lkeCA9PT0gaSA/ICdiZy13aGl0ZSB3LTMnIDogJ2JnLXdoaXRlLzUwJ31gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHthbGxWaWRlb3MubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIGdhcC00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWxsVmlkZW9zLm1hcCgodmlkZW9VcmwsIGkpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17dmlkZW9Vcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJncm91cCBibG9jayByZWxhdGl2ZSByb3VuZGVkLTJ4bCBvdmVyZmxvdy1oaWRkZW4gc2hhZG93LW1kIGJnLWdyYXktOTAwIGFzcGVjdC12aWRlbyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBib3JkZXIgYm9yZGVyLWdyYXktMTAwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17YWxsSW1hZ2VzWzBdIHx8ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYxMTE2MjYxNzQ3NC01YjIxZTg3OWUxMTM/cT04MCZ3PTEwMDAmYXV0bz1mb3JtYXQmZml0PWNyb3AnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0PXtgVmlkZW8gdGh1bWJuYWlsIC0gJHtpICsgMX1gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCB3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlciBvcGFjaXR5LTUwIGdyb3VwLWhvdmVyOm9wYWNpdHktNDAgdHJhbnNpdGlvbi1vcGFjaXR5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxQbGF5Q2lyY2xlIHNpemU9ezU2fSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIHJlbGF0aXZlIHotMTAgZ3JvdXAtaG92ZXI6c2NhbGUtMTEwIHRyYW5zaXRpb24tdHJhbnNmb3JtIHNoYWRvdy1zbVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9KSgpfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8SW1hZ2VNb2RhbCBcclxuICAgICAgICBpbWFnZXM9e3pvb21lZEltYWdlID8gW3pvb21lZEltYWdlXSA6IFtdfVxyXG4gICAgICAgIGluaXRpYWxJbmRleD17MH1cclxuICAgICAgICBpc09wZW49eyEhem9vbWVkSW1hZ2V9XHJcbiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0Wm9vbWVkSW1hZ2UobnVsbCl9XHJcbiAgICAgIC8+XHJcblxyXG4gICAgICB7LyogUWlsaW5nYW4gaXNobGFyIC8gUG9zdHMgU2VjdGlvbiAqL31cclxuICAgICAge3RydWUgJiYgKFxyXG5cclxuXHJcbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG14LWF1dG8gcHgtNiBweS0xNlwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi04IGJvcmRlci1sLTQgYm9yZGVyLWJsdWUtNjAwIHBsLTRcIj5cclxuICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTgwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZVwiPlFpbGluZ2FuIGlzaGxhciAvIEhhbWtvcmxpa2xhcjwvaDI+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBnYXAtNiBzbTpncmlkLWNvbHMtMiBsZzpncmlkLWNvbHMtMyB4bDpncmlkLWNvbHMtNFwiPlxyXG4gICAgICAgICAgICB7ZGVwdC5kZXBhcnRtZW50X3Bvc3RzLm1hcCgocG9zdDogYW55KSA9PiAoXHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAga2V5PXtwb3N0LmlkfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2VsZWN0ZWRQb3N0KHtcclxuICAgICAgICAgICAgICAgICAgaWQ6IHBvc3QuaWQsXHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiBnZXRMb2NhbGl6ZWRGaWVsZChwb3N0LCAndGl0bGUnKSxcclxuICAgICAgICAgICAgICAgICAgZGF0ZTogcG9zdC5kYXRlLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiBnZXRMb2NhbGl6ZWRGaWVsZChwb3N0LCAnY29udGVudCcpLFxyXG4gICAgICAgICAgICAgICAgICBpbWFnZTogcG9zdC5pbWFnZSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICBpbWFnZXM6IHBvc3QuaW1hZ2UgPyBbeyBpZDogMSwgaW1hZ2VVcmw6IHBvc3QuaW1hZ2UgfV0gOiBbXVxyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJncm91cCBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC1bMnJlbV0gYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgYmctd2hpdGUgc2hhZG93LXNtIHRyYW5zaXRpb24tdHJhbnNmb3JtIGhvdmVyOi10cmFuc2xhdGUteS0xIGhvdmVyOnNoYWRvdy14bCB0ZXh0LWxlZnQgZmxleCBmbGV4LWNvbFwiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTQwIG92ZXJmbG93LWhpZGRlbiBiZy1zbGF0ZS0yMDAgdy1mdWxsIHJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtwb3N0LmltYWdlID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM9e3Bvc3QuaW1hZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsdD17Z2V0TG9jYWxpemVkRmllbGQocG9zdCwgJ3RpdGxlJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtZnVsbCB3LWZ1bGwgb2JqZWN0LWNvdmVyIHRyYW5zaXRpb24tdHJhbnNmb3JtIGR1cmF0aW9uLTcwMCBncm91cC1ob3ZlcjpzY2FsZS0xMDVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBiZy1zbGF0ZS0xMDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC1zbGF0ZS00MDBcIj5SYXNtIHlvJ3E8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTYgZmxleC0xIGZsZXggZmxleC1jb2xcIj5cclxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXNsYXRlLTQwMCBtYi0yXCI+e3Bvc3QuZGF0ZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTkwMCBncm91cC1ob3Zlcjp0ZXh0LWJsdWUtNzAwIGxpbmUtY2xhbXAtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtnZXRMb2NhbGl6ZWRGaWVsZChwb3N0LCAndGl0bGUnKX1cclxuICAgICAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0zIHRleHQtc20gdGV4dC1zbGF0ZS02MDAgbGluZS1jbGFtcC0zIGZsZXgtMSBwcm9zZSBwcm9zZS1zbVwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogZ2V0TG9jYWxpemVkRmllbGQocG9zdCwgJ2NvbnRlbnQnKSB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZm9udC1ib2xkIHRleHQtYmx1ZS02MDAgdGV4dC1zbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIEJhdGFmc2lsIG8ncWlzaCAmcmFycjtcclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7c2VsZWN0ZWRQb3N0ICYmIChcclxuICAgICAgICA8TmV3c01vZGFsIGl0ZW09e3NlbGVjdGVkUG9zdH0gb25DbG9zZT17KCkgPT4gc2V0U2VsZWN0ZWRQb3N0KG51bGwpfSAvPlxyXG4gICAgICApfVxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEZXBhcnRtZW50UGFnZTtcclxuIl0sImZpbGUiOiJDOi9Vc2Vycy9TYWxvaGlkZGluIE1hcmthei9EZXNrdG9wL1NBWVQvU0FZVC9mcm9udGVuZC9wYWdlcy9EZXBhcnRtZW50UGFnZS50c3gifQ==