'use client';

import { useState } from 'react';
import { LanguageProvider } from '@/contexts/language-context';
import { EditorHeader } from '@/components/editor/editor-header';
import { LeftSidebar } from '@/components/editor/left-sidebar';
import { TabContent } from '@/components/editor/tab-content';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { RightSidebar } from '@/components/editor/right-sidebar';

type SidebarTab =
  | 'apps'
  | 'ratio'
  | 'layout'
  | 'templates'
  | 'upload'
  | 'text'
  | 'image'
  | 'assets'
  | 'background'
  | 'batch';

// 背景图层（特殊图层，始终存在）
const BACKGROUND_LAYER_ID = 'background-layer';

/** 动态打开的 App Tab（如 AI 生图），显示在 batch 下方，可关闭 */
export type OpenAppTab = { id: string; label: string };

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<SidebarTab | string>('ratio');
  const [openAppTabs, setOpenAppTabs] = useState<OpenAppTab[]>([]);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [userStatus, setUserStatus] = useState<'guest' | 'free' | 'pro'>('free');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 });
  const [activeTool, setActiveTool] = useState<string | undefined>();
  const [selectedLayout, setSelectedLayout] = useState<any>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [selectedLayerIds, setSelectedLayerIds] = useState<Set<string>>(new Set()); // 多选图层
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set()); // 展开的分组
  const [isLayoutSelectMode, setIsLayoutSelectMode] = useState(false);
  const [isLeftTabContentCollapsed, setIsLeftTabContentCollapsed] = useState(false);
  
  // 背景图层状态
  const [backgroundLayer, setBackgroundLayer] = useState({
    id: BACKGROUND_LAYER_ID,
    name: 'Background',
    type: 'background' as const,
    color: '#FFFFFF',
    imageUrl: undefined as string | undefined,
    gradient: undefined as string | undefined,
    visible: true,
    locked: false,
  });

  const handleTabChange = (tab: SidebarTab | string) => {
    setActiveTab(tab);
  };

  const handleOpenAppTab = (appId: string, label: string) => {
    setOpenAppTabs((prev) => {
      if (prev.some((t) => t.id === appId)) return prev;
      return [...prev, { id: appId, label }];
    });
    setActiveTab(appId);
  };

  const handleCloseAppTab = (tabId: string) => {
    setOpenAppTabs((prev) => prev.filter((t) => t.id !== tabId));
    setActiveTab((current) => (current === tabId ? 'apps' : current));
  };

  const handleToolSelect = (tool: string) => {
    setActiveTool(tool === activeTool ? undefined : tool);
  };

  // 根据图层类型获取对应的侧边栏 Tab
  const getTabByLayerType = (layerType: string): SidebarTab | null => {
    switch (layerType) {
      case 'text':
        return 'text';
      case 'image':
        return 'image';
      case 'background':
        return 'background';
      case 'shape':
        return 'assets';
      case 'layout':
        return 'layout';
      default:
        return null;
    }
  };

  // 选中图层并自动切换侧边栏
  const handleLayerSelect = (layerId: string | null, multiSelect?: Set<string>) => {
    if (multiSelect && multiSelect.size > 0) {
      // 多选模式 - 过滤掉 background 图层和 group 图层
      const validIds = new Set(Array.from(multiSelect).filter(id => {
        const layer = layers.find(l => l.id === id);
        return layer && 
               layer.type !== 'background' && 
               layer.id !== BACKGROUND_LAYER_ID && 
               !layer.isGroup;
      }));
      
      if (validIds.size > 0) {
        setSelectedLayerIds(validIds);
        setSelectedLayerId(null);
      } else {
        setSelectedLayerId(null);
        setSelectedLayerIds(new Set());
      }
    } else {
      // 单选模式 - 如果是 background 图层，允许选中
      if (layerId && layerId === BACKGROUND_LAYER_ID) {
        setSelectedLayerId(layerId);
        setSelectedLayerIds(new Set());
      } else if (layerId) {
        // 检查是否是 group 图层
        const layer = layers.find(l => l.id === layerId);
        if (layer && layer.isGroup) {
          setSelectedLayerId(layerId);
          setSelectedLayerIds(new Set());
        } else {
          setSelectedLayerId(layerId);
          setSelectedLayerIds(new Set());
        }
      } else {
        setSelectedLayerId(null);
        setSelectedLayerIds(new Set());
      }
    }

    // 如果没有选中任何图层，不切换侧边栏
    if (!layerId && (!multiSelect || multiSelect.size === 0)) {
      return;
    }

    // 根据图层类型切换侧边栏（仅单选时）
    if (layerId && layerId === BACKGROUND_LAYER_ID) {
      setActiveTab('background');
    } else if (layerId) {
      const layer = layers.find(l => l.id === layerId);
      if (layer) {
        const tab = getTabByLayerType(layer.type);
        if (tab) {
          setActiveTab(tab);
        }
      }
    }
  };

  // 分组图层（参考 Photoshop 的实现）
  const handleGroupLayers = (layerIds: string[]) => {
    if (layerIds.length < 2) return;
    
    // 过滤掉 background 图层和已经是 group 的图层
    const validLayerIds = layerIds.filter(id => {
      const layer = layers.find(l => l.id === id);
      return layer && 
             layer.type !== 'background' && 
             layer.id !== BACKGROUND_LAYER_ID && 
             !layer.isGroup &&
             !(layer as any).groupId;
    });
    
    if (validLayerIds.length < 2) return;
    
    const groupId = `group-${Date.now()}`;
    const groupName = `Group ${layers.filter(l => l.isGroup).length + 1}`;
    
    // 计算子图层的边界框（用于 group 图层的位置和尺寸）
    const childLayers = validLayerIds.map(id => layers.find(l => l.id === id)).filter(Boolean);
    if (childLayers.length === 0) return;
    
    const minX = Math.min(...childLayers.map(l => l!.x ?? 0));
    const minY = Math.min(...childLayers.map(l => l!.y ?? 0));
    const maxX = Math.max(...childLayers.map(l => (l!.x ?? 0) + (l!.width ?? 100)));
    const maxY = Math.max(...childLayers.map(l => (l!.y ?? 0) + (l!.height ?? 100)));
    
    // 创建分组图层（group 图层本身不在画布上渲染，只是一个容器）
    const groupLayer = {
      id: groupId,
      name: groupName,
      type: 'group' as const,
      isGroup: true,
      groupIds: validLayerIds, // 保存子图层 ID 列表
      visible: true,
      locked: false,
      zIndex: Math.max(...validLayerIds.map(id => {
        const layer = layers.find(l => l.id === id);
        return layer?.zIndex ?? 0;
      })),
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
    
    // 更新图层，给子图层添加 groupId 属性
    const updatedLayers = layers.map(layer => {
      if (validLayerIds.includes(layer.id)) {
        return { ...layer, groupId: groupId };
      }
      return layer;
    });
    
    // 将 group 图层插入到所有子图层之后（按 zIndex）
    const maxZIndex = Math.max(...validLayerIds.map(id => {
      const layer = layers.find(l => l.id === id);
      return layer?.zIndex ?? 0;
    }), 0);
    groupLayer.zIndex = maxZIndex + 1;
    
    const finalLayers = [...updatedLayers, groupLayer];
    setLayers(finalLayers);
    setSelectedLayerId(groupId);
    setSelectedLayerIds(new Set());
    // 默认展开新创建的 group
    setExpandedGroups(prev => new Set([...prev, groupId]));
  };

  // 取消分组
  const handleUngroupLayers = (groupId: string) => {
    const groupLayer = layers.find(l => l.id === groupId && l.isGroup);
    if (!groupLayer || !groupLayer.groupIds) return;
    
    // 移除分组图层，并移除子图层的 groupId
    const updatedLayers = layers
      .filter(layer => layer.id !== groupId)
      .map(layer => {
        if (groupLayer.groupIds.includes(layer.id)) {
          // 移除 groupId 属性
          const { groupId: _, ...rest } = layer as any;
          return rest;
        }
        return layer;
      });
    
    setLayers(updatedLayers);
    setSelectedLayerId(null);
    setSelectedLayerIds(new Set());
  };

  // 切换分组展开/折叠
  const handleToggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // 处理 layout 选择模式
  const handleLayoutSelect = () => {
    setIsLayoutSelectMode(true);
    setActiveTab('layout');
  };

  // 处理 layout 选择（从左侧 layout 页面选择）
  const handleLayoutSelectFromSidebar = (layout: any) => {
    if (isLayoutSelectMode && selectedLayerId) {
      const layer = layers.find(l => l.id === selectedLayerId);
      if (layer && layer.type === 'layout') {
        // 更新图层的 layout
        setLayers(layers.map(l => 
          l.id === selectedLayerId 
            ? { ...l, layout: { ...layout, frames: layout.frames.map((f: any) => ({ ...f })) } }
            : l
        ));
        setSelectedLayout(layout);
      }
    }
    setIsLayoutSelectMode(false);
  };

  const handleCreateNew = () => {
    console.log('Create new');
    // 处理创建新项目逻辑
  };

  const handleUndo = () => {
    console.log('Undo');
    // 处理撤销逻辑
  };

  const handleRedo = () => {
    console.log('Redo');
    // 处理重做逻辑
  };

  const handleDownload = () => {
    console.log('Download');
    // 处理下载逻辑
  };

  const handleUpgrade = () => {
    console.log('Upgrade');
    setUserStatus('pro');
  };

  return (
    <LanguageProvider>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden relative">
      {/* Layout 选择模式蒙层 - 覆盖左侧边栏以外的所有区域 */}
      {isLayoutSelectMode && (
        <div 
          className="fixed inset-0 left-20 bg-black/40 z-30"
          onClick={() => setIsLayoutSelectMode(false)}
        />
      )}

      {/* 编辑器头部 */}
      <EditorHeader
        userStatus={userStatus}
        onCreateNew={handleCreateNew}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDownload={handleDownload}
        onUpgrade={handleUpgrade}
        className={isLayoutSelectMode ? 'relative z-40' : ''}
      />

      {/* 主编辑区域 */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* 左侧边栏 */}
        <LeftSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          openAppTabs={openAppTabs}
          onCloseAppTab={handleCloseAppTab}
          highlightTab={isLayoutSelectMode ? 'layout' : undefined}
          className={isLayoutSelectMode ? 'relative z-40' : ''}
        />

        {/* Tab 内容面板 */}
        <TabContent 
          activeTab={activeTab}
          onOpenApp={handleOpenAppTab}
          canvasSize={canvasSize}
          onSizeChange={(width, height) => setCanvasSize({ width, height })}
          isCollapsed={isLeftTabContentCollapsed}
          onToggleCollapse={() => setIsLeftTabContentCollapsed(!isLeftTabContentCollapsed)}
          onLayoutSelect={(layout) => {
            // 如果处于 layout 选择模式，更新现有图层
            if (isLayoutSelectMode && selectedLayerId) {
              handleLayoutSelectFromSidebar(layout);
            } else {
              // 否则创建新图层
              const newLayer = {
                id: `layer-${Date.now()}`,
                name: layout.name || 'Layout',
                type: 'layout' as const,
                layout: { ...layout, frames: layout.frames.map((f: any) => ({ ...f })) },
                visible: true,
                locked: false,
                zIndex: layers.length,
                x: 0,
                y: 0,
                width: 100,
                height: 100,
              };
              setLayers([...layers, newLayer]);
              setSelectedLayerId(newLayer.id);
              setSelectedLayout(layout);
            }
          }}
          isLayoutSelectMode={isLayoutSelectMode}
          onTextAdd={(textLayer) => {
            // 创建文本图层
            const newLayer = {
              id: textLayer.id,
              name: textLayer.text.substring(0, 20) || 'Text',
              type: 'text' as const,
              text: textLayer.text,
              textStyle: textLayer.style,
              fontSize: textLayer.fontSize || '24px',
              fontWeight: textLayer.fontWeight || 'normal',
              visible: true,
              locked: false,
              zIndex: layers.length,
              x: 10 + (layers.length * 2) % 20, // 稍微错开位置
              y: 10 + (layers.length * 2) % 20,
              width: 80,
              height: 15,
            };
            setLayers([...layers, newLayer]);
            setSelectedLayerId(newLayer.id);
          }}
          onImageAdd={(imageLayer) => {
            // 创建图片图层
            const newLayer = {
              id: imageLayer.id,
              name: imageLayer.name || 'Image',
              type: 'image' as const,
              imageUrl: imageLayer.url,
              visible: true,
              locked: false,
              zIndex: layers.length,
              x: 5 + (layers.length * 3) % 15,
              y: 5 + (layers.length * 3) % 15,
              width: 50,
              height: 50,
            };
            setLayers([...layers, newLayer]);
            setSelectedLayerId(newLayer.id);
          }}
          onShapeAdd={(shapeLayer) => {
            // 创建形状图层
            const newLayer = {
              id: shapeLayer.id,
              name: shapeLayer.label || 'Shape',
              type: 'shape' as const,
              icon: shapeLayer.icon,
              color: shapeLayer.color,
              visible: true,
              locked: false,
              zIndex: layers.length,
              x: 20 + (layers.length * 5) % 30,
              y: 20 + (layers.length * 5) % 30,
              width: 15,
              height: 15,
            };
            setLayers([...layers, newLayer]);
            setSelectedLayerId(newLayer.id);
          }}
        />

        {/* 中间编辑区域 */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* 编辑工具栏 */}
          <EditorToolbar onToolSelect={handleToolSelect} activeTool={activeTool} />

          {/* 画布区域 */}
          <EditorCanvas 
            imageUrl={imageUrl} 
            canvasSize={canvasSize} 
            isCropMode={activeTool === 'crop'}
            onCanvasSizeChange={(width, height) => setCanvasSize({ width, height })}
            selectedLayout={selectedLayout}
            layers={layers}
            selectedLayerId={selectedLayerId}
            selectedLayerIds={selectedLayerIds}
            onLayerSelect={handleLayerSelect}
            backgroundLayer={backgroundLayer}
            onLayoutSelect={handleLayoutSelect}
            onGroupLayers={handleGroupLayers}
            onUngroupLayers={handleUngroupLayers}
            onLayerResize={(layerId, newSize) => {
              setLayers(layers.map(layer => {
                if (layer.id === layerId) {
                  return { 
                    ...layer, 
                    x: newSize.x,
                    y: newSize.y,
                    width: newSize.width,
                    height: newSize.height,
                  };
                }
                return layer;
              }));
            }}
            onLayoutFrameImageChange={(frameId, imageUrl, layerId) => {
              if (layerId) {
                // 更新指定图层的 layout
                setLayers(layers.map(layer => {
                  if (layer.id === layerId && layer.layout) {
                    return {
                      ...layer,
                      layout: {
                        ...layer.layout,
                        frames: layer.layout.frames.map((f: any) =>
                          f.id === frameId ? { ...f, imageUrl } : f
                        ),
                      },
                    };
                  }
                  return layer;
                }));
                // 如果当前选中的 layout 是这个图层，也更新它
                if (selectedLayout) {
                  const updatedLayout = {
                    ...selectedLayout,
                    frames: selectedLayout.frames.map((f: any) =>
                      f.id === frameId ? { ...f, imageUrl } : f
                    ),
                  };
                  setSelectedLayout(updatedLayout);
                }
              } else if (selectedLayout) {
                const updatedLayout = {
                  ...selectedLayout,
                  frames: selectedLayout.frames.map((f: any) =>
                    f.id === frameId ? { ...f, imageUrl } : f
                  ),
                };
                setSelectedLayout(updatedLayout);
              }
            }}
          />
        </div>

        {/* 右侧图层面板 */}
        <RightSidebar
          layers={[
            // 普通图层 - 按 zIndex 降序排列（zIndex 大的在上，小的在下）
            ...layers
              .slice()
              .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0))
              .map(layer => ({
                ...layer, // 传递所有属性，包括 groupId 和 isGroup
                thumbnail: layer.layout ? undefined : layer.imageUrl,
              })),
            // 背景图层（始终在最底部）
            {
              id: backgroundLayer.id,
              name: backgroundLayer.name,
              type: 'background',
              thumbnail: backgroundLayer.imageUrl,
              locked: backgroundLayer.locked,
              visible: backgroundLayer.visible,
              isBackground: true,
            },
          ]}
          selectedLayerId={selectedLayerId}
          onLayerSelect={handleLayerSelect}
          onLayerLockToggle={(layerId) => {
            if (layerId === BACKGROUND_LAYER_ID) {
              setBackgroundLayer(prev => ({ ...prev, locked: !prev.locked }));
            } else {
              setLayers(layers.map(layer =>
                layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
              ));
            }
          }}
          onLayerVisibilityToggle={(layerId) => {
            if (layerId === BACKGROUND_LAYER_ID) {
              setBackgroundLayer(prev => ({ ...prev, visible: !prev.visible }));
            } else {
              setLayers(layers.map(layer =>
                layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
              ));
            }
          }}
          onLayerReorder={(fromLayerId, toLayerId) => {
            // 找到原始索引
            const fromIndex = layers.findIndex(l => l.id === fromLayerId);
            const toIndex = layers.findIndex(l => l.id === toLayerId);
            
            if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
              return;
            }
            
            // 重新排序图层
            const newLayers = [...layers];
            const [movedLayer] = newLayers.splice(fromIndex, 1);
            newLayers.splice(toIndex, 0, movedLayer);
            
            // 更新 zIndex
            const updatedLayers = newLayers.map((layer, index) => ({
              ...layer,
              zIndex: index,
            }));
            
            setLayers(updatedLayers);
          }}
          expandedGroups={expandedGroups}
          onToggleGroup={handleToggleGroup}
          isCollapsed={isRightSidebarCollapsed}
          onToggleCollapse={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
        />
      </div>
    </div>
    </LanguageProvider>
  );
}
