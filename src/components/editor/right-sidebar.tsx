'use client';

import { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Eye, EyeOff, GripVertical, ChevronLeft, ChevronRight, ChevronDown, Type, Image, Layers, Package, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

type LayerType = 'text' | 'image' | 'layout' | 'shape' | 'background';

interface Layer {
  id: string;
  name: string;
  type?: LayerType;
  thumbnail?: string;
  locked?: boolean;
  visible?: boolean;
  isBackground?: boolean;
}

// 图层类型图标映射
const layerTypeIcons: Record<LayerType, React.ComponentType<{ className?: string }>> = {
  text: Type,
  image: Image,
  layout: Layers,
  shape: Package,
  background: Palette,
};

interface RightSidebarProps {
  layers?: Layer[];
  selectedLayerId?: string | null;
  onLayerSelect?: (layerId: string | null) => void;
  onLayerLockToggle?: (layerId: string) => void;
  onLayerVisibilityToggle?: (layerId: string) => void;
  onLayerReorder?: (fromLayerId: string, toLayerId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  expandedGroups?: Set<string>;
  onToggleGroup?: (groupId: string) => void;
}

export function RightSidebar({
  layers = [],
  selectedLayerId = null,
  onLayerSelect,
  onLayerLockToggle,
  onLayerVisibilityToggle,
  onLayerReorder,
  isCollapsed = false,
  onToggleCollapse,
  expandedGroups = new Set(),
  onToggleGroup,
}: RightSidebarProps) {
  const { t } = useLanguage();
  
  // 图层类型标签映射
  const layerTypeLabels: Record<LayerType, string> = {
    text: t.text,
    image: t.image,
    layout: t.layout,
    shape: t.shape,
    background: t.background,
  };
  // 拖拽状态
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    dragIndex: number | null;
    dragOverIndex: number | null;
    startY: number;
  }>({
    isDragging: false,
    dragIndex: null,
    dragOverIndex: null,
    startY: 0,
  });
  
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  // 默认图层数据
  const defaultLayers: Layer[] = [
    {
      id: '1',
      name: '2b706b...',
      thumbnail: '/placeholder-image.jpg',
      locked: true,
      visible: true,
    },
    {
      id: '2',
      name: 'Background',
      visible: true,
    },
  ];

  const displayLayers = layers.length > 0 ? layers : defaultLayers;
  
  // 分离分组图层、普通图层和背景图层
  const groupLayers = displayLayers.filter(l => {
    const isGroup = (l as any).isGroup === true || (l as any).type === 'group';
    if (isGroup) {
      console.log('找到 group 图层:', { id: l.id, name: l.name, isGroup: (l as any).isGroup, type: l.type });
    }
    return isGroup;
  });
  const regularLayers = displayLayers.filter(l => {
    const isBackground = l.isBackground === true || l.type === 'background';
    const isGroup = (l as any).isGroup === true || (l as any).type === 'group';
    return !isBackground && !isGroup;
  });
  const backgroundLayer = displayLayers.find(l => l.isBackground === true || l.type === 'background');
  
  console.log('右侧边栏图层组织:', {
    totalLayers: displayLayers.length,
    groupLayersCount: groupLayers.length,
    regularLayersCount: regularLayers.length,
    groupLayers: groupLayers.map((l: any) => ({ id: l.id, name: l.name, groupIds: (l as any).groupIds })),
    regularLayersWithGroupId: regularLayers
      .filter((l: any) => (l as any).groupId)
      .map((l: any) => ({ id: l.id, name: l.name, groupId: (l as any).groupId }))
  });
  
  // 构建分组结构：将分组图层和其子图层组织在一起
  const organizedLayers: Array<{ type: 'group' | 'layer'; data: any; children?: any[] }> = [];
  const processedLayerIds = new Set<string>();
  
  console.log('右侧边栏 - 开始组织图层:', {
    totalLayers: displayLayers.length,
    groupLayers: groupLayers.map((l: any) => ({ id: l.id, name: l.name, groupIds: (l as any).groupIds })),
    regularLayers: regularLayers.map((l: any) => ({ id: l.id, name: l.name, groupId: (l as any).groupId }))
  });
  
  // 先添加分组图层及其子图层（按 zIndex 排序，从下到上）
  groupLayers
    .sort((a, b) => ((a as any).zIndex ?? 0) - ((b as any).zIndex ?? 0))
    .forEach(groupLayer => {
      const groupData = groupLayer as any;
      // 根据 groupId 属性查找子图层（子图层有 groupId 属性指向 group 图层的 id）
      const childLayers = regularLayers
        .filter(l => {
          const layerGroupId = (l as any).groupId;
          const matches = layerGroupId === groupData.id;
          if (matches) {
            console.log('找到子图层:', { 
              layerId: l.id, 
              layerName: l.name, 
              groupId: groupData.id,
              layerGroupId,
              layer: l
            });
          } else if (layerGroupId) {
            console.log('图层有 groupId 但不匹配:', { 
              layerId: l.id, 
              layerName: l.name, 
              layerGroupId, 
              expectedGroupId: groupData.id 
            });
          }
          return matches;
        })
        .sort((a: any, b: any) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
      
      console.log('Group 图层:', { 
        groupId: groupData.id, 
        groupName: groupData.name, 
        childCount: childLayers.length,
        childIds: childLayers.map((l: any) => l.id),
        allRegularLayers: regularLayers.map((l: any) => ({ id: l.id, name: l.name, groupId: (l as any).groupId }))
      });
      
      childLayers.forEach((l: any) => processedLayerIds.add(l.id));
      organizedLayers.push({
        type: 'group',
        data: groupData,
        children: childLayers,
      });
    });
  
  // 添加未分组的普通图层（按 zIndex 排序，从下到上）
  regularLayers
    .filter(layer => !processedLayerIds.has(layer.id))
    .sort((a, b) => ((a as any).zIndex ?? 0) - ((b as any).zIndex ?? 0))
    .forEach(layer => {
      organizedLayers.push({ type: 'layer', data: layer });
    });
  
  console.log('最终 organizedLayers:', organizedLayers.map(item => ({
    type: item.type,
    id: item.data.id,
    name: item.data.name,
    childrenCount: item.children?.length || 0,
    childrenIds: item.children?.map((c: any) => c.id) || []
  })));
  
  // 用于拖拽的扁平列表（保持原有逻辑）
  const draggableLayers = displayLayers.filter(l => !l.isBackground);

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({
      isDragging: true,
      dragIndex: index,
      dragOverIndex: index,
      startY: e.clientY,
    });
  };

  // 处理鼠标移动
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!listRef.current || dragState.dragIndex === null) return;

      // 计算当前鼠标位置对应的目标索引
      const listRect = listRef.current.getBoundingClientRect();
      const mouseY = e.clientY - listRect.top;
      
      let newDragOverIndex = 0;
      let accumulatedHeight = 0;
      
      for (let i = 0; i < draggableLayers.length; i++) {
        const itemEl = itemRefs.current[i];
        if (itemEl) {
          const itemHeight = itemEl.offsetHeight + 4; // 包含 margin
          if (mouseY > accumulatedHeight + itemHeight / 2) {
            newDragOverIndex = i + 1;
          }
          accumulatedHeight += itemHeight;
        }
      }
      
      // 限制在有效范围内
      newDragOverIndex = Math.max(0, Math.min(newDragOverIndex, draggableLayers.length));
      
      if (newDragOverIndex !== dragState.dragOverIndex) {
        setDragState(prev => ({ ...prev, dragOverIndex: newDragOverIndex }));
      }
    };

    const handleMouseUp = () => {
      if (dragState.dragIndex !== null && dragState.dragOverIndex !== null) {
        const fromIndex = dragState.dragIndex;
        let toIndex = dragState.dragOverIndex;
        
        // 调整目标索引
        // 如果向下拖（toIndex > fromIndex），移除元素后目标位置需要减1
        // 如果向上拖（toIndex <= fromIndex），目标位置不变
        if (toIndex > fromIndex) {
          toIndex = toIndex - 1;
        }
        
        // 确保索引有效
        toIndex = Math.max(0, Math.min(toIndex, draggableLayers.length - 1));
        
        if (fromIndex !== toIndex) {
          const fromLayer = draggableLayers[fromIndex];
          const toLayer = draggableLayers[toIndex];
          if (fromLayer && toLayer) {
            onLayerReorder?.(fromLayer.id, toLayer.id);
          }
        }
      }
      
      setDragState({
        isDragging: false,
        dragIndex: null,
        dragOverIndex: null,
        startY: 0,
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, dragState.dragIndex, dragState.dragOverIndex, draggableLayers.length, onLayerReorder]);

  return (
    <div className="relative h-full">
      {/* 内容区域 */}
      <div className={`h-full transition-all duration-300 ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'} bg-white border-l border-gray-200 flex flex-col`}>
        {!isCollapsed && (
          <>
            {/* 标题栏 */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200 flex-shrink-0 h-[61px]">
              <h3 className="text-sm font-semibold text-gray-900">{t.layers}</h3>
            </div>

            {/* 图层列表 */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-2 sidebar-scrollbar">
        {/* 分组和图层 */}
        {organizedLayers.map((item, itemIndex) => {
          if (item.type === 'group') {
            const groupLayer = item.data;
            const isGroupExpanded = expandedGroups.has(groupLayer.id);
            const isGroupSelected = selectedLayerId === groupLayer.id;
            const GroupIcon = Layers;
            
            return (
              <div key={groupLayer.id} className="mb-1">
                {/* 分组标题 */}
                <div
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                    isGroupSelected ? 'bg-teal-50 border-2 border-teal-500' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* 展开/折叠按钮 */}
                  <button
                    onClick={() => onToggleGroup?.(groupLayer.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                  >
                    {isGroupExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  {/* 分组图标和信息 */}
                  <div 
                    className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                    onClick={() => onLayerSelect?.(groupLayer.id)}
                  >
                    <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center bg-gray-100">
                      <GroupIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${groupLayer.visible !== false ? 'text-gray-900' : 'text-gray-400'}`}>
                        {groupLayer.name}
                      </p>
                      <p className="text-xs text-gray-500">Group ({item.children?.length || 0})</p>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerVisibilityToggle?.(groupLayer.id);
                      }}
                      className={`p-1.5 rounded transition-colors ${
                        groupLayer.visible !== false ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-gray-200 text-gray-300'
                      }`}
                      title={groupLayer.visible !== false ? t.hideLayer : t.showLayer}
                    >
                      {groupLayer.visible !== false ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerLockToggle?.(groupLayer.id);
                      }}
                      className={`p-1.5 rounded transition-colors ${
                        groupLayer.locked ? 'hover:bg-gray-200 text-amber-500' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                      title={groupLayer.locked ? t.unlockLayer : t.lockLayer}
                    >
                      {groupLayer.locked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* 分组子图层（展开时显示） */}
                {isGroupExpanded && item.children && item.children.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((layer) => {
                      const isSelected = selectedLayerId === layer.id;
                      const LayerIcon = layer.type && layer.type in layerTypeIcons ? layerTypeIcons[layer.type as LayerType] : null;
                      const layerTypeLabel = layer.type && layer.type in layerTypeLabels ? layerTypeLabels[layer.type as LayerType] : '';
                      const isVisible = layer.visible !== false;
                      const isLocked = layer.locked === true;
                      
                      return (
                        <div
                          key={layer.id}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                            isSelected ? 'bg-teal-50 border border-teal-300' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                          
                          <div 
                            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                            onClick={() => onLayerSelect?.(layer.id)}
                          >
                            {layer.thumbnail ? (
                              <div className="w-8 h-8 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                                <img src={layer.thumbnail} alt={layer.name} className="w-full h-full object-cover" />
                              </div>
                            ) : LayerIcon ? (
                              <div className="w-8 h-8 rounded flex-shrink-0 flex items-center justify-center bg-gray-100">
                                <LayerIcon className="w-4 h-4 text-gray-500" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded bg-white border border-gray-300 flex-shrink-0" />
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs truncate ${isVisible ? 'text-gray-900' : 'text-gray-400'}`}>{layer.name}</p>
                              {layer.type && (
                                <p className="text-[10px] text-gray-500">{layerTypeLabel}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onLayerVisibilityToggle?.(layer.id);
                              }}
                              className={`p-1 rounded transition-colors ${
                                isVisible ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-gray-200 text-gray-300'
                              }`}
                            >
                              {isVisible ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onLayerLockToggle?.(layer.id);
                              }}
                              className={`p-1 rounded transition-colors ${
                                isLocked ? 'hover:bg-gray-200 text-amber-500' : 'hover:bg-gray-200 text-gray-500'
                              }`}
                            >
                              {isLocked ? (
                                <Lock className="w-3 h-3" />
                              ) : (
                                <Unlock className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
            // 普通图层
            const layer = item.data;
            const index = draggableLayers.findIndex(l => l.id === layer.id);
            const isSelected = selectedLayerId === layer.id;
            const LayerIcon = layer.type && layer.type in layerTypeIcons ? layerTypeIcons[layer.type as LayerType] : null;
            const layerTypeLabel = layer.type && layer.type in layerTypeLabels ? layerTypeLabels[layer.type as LayerType] : '';
            const isVisible = layer.visible !== false;
            const isLocked = layer.locked === true;
            const isDragging = dragState.isDragging && dragState.dragIndex === index;
            const showDropIndicatorAbove = dragState.isDragging && dragState.dragOverIndex === index && dragState.dragIndex !== index;
            const showDropIndicatorBelow = dragState.isDragging && dragState.dragOverIndex === index + 1 && dragState.dragIndex !== index && dragState.dragIndex !== index + 1;
            
            return (
              <div key={layer.id}>
                {/* 拖放指示器 - 上方 */}
                {showDropIndicatorAbove && (
                  <div className="h-0.5 bg-teal-500 rounded-full my-1 mx-2" />
                )}
                
                <div
                  ref={(el) => { if (index >= 0) itemRefs.current[index] = el; }}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all mb-1 ${
                    isSelected ? 'bg-teal-50 border-2 border-teal-500' : 'hover:bg-gray-50'
                  } ${isDragging ? 'opacity-50 scale-95 shadow-lg' : ''}`}
                >
                  {/* 拖动手柄 */}
                  <button
                    className={`p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 ${
                      dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                    title={t.dragToReorder}
                    onMouseDown={(e) => handleDragStart(e, index)}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* 可点击区域：缩略图 + 图层信息 */}
                  <div 
                    className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                    onClick={() => onLayerSelect?.(layer.id)}
                  >
                    {/* 缩略图/类型图标 */}
                    {layer.thumbnail ? (
                      <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                        <img
                          src={layer.thumbnail}
                          alt={layer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : LayerIcon ? (
                      <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center bg-gray-100">
                        <LayerIcon className="w-5 h-5 text-gray-500" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-white border border-gray-300 flex-shrink-0" />
                    )}

                    {/* 图层信息 */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isVisible ? 'text-gray-900' : 'text-gray-400'}`}>{layer.name}</p>
                      {layer.type && (
                        <p className="text-xs text-gray-500">{layerTypeLabel}</p>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {/* 显示/隐藏按钮 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerVisibilityToggle?.(layer.id);
                      }}
                      className={`p-1.5 rounded transition-colors ${
                        isVisible ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-gray-200 text-gray-300'
                      }`}
                      title={isVisible ? t.hideLayer : t.showLayer}
                    >
                      {isVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>

                {/* 锁定/解锁按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerLockToggle?.(layer.id);
                  }}
                  className={`p-1.5 rounded transition-colors ${
                    isLocked ? 'hover:bg-gray-200 text-amber-500' : 'hover:bg-gray-200 text-gray-400'
                  }`}
                  title={isLocked ? t.unlockLayer : t.lockLayer}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* 拖放指示器 - 下方（最后一个元素） */}
            {showDropIndicatorBelow && (
              <div className="h-0.5 bg-teal-500 rounded-full my-1 mx-2" />
            )}
          </div>
            );
          }
        })}
        
        {/* 背景图层（不可拖拽） */}
        {backgroundLayer && (
          <div
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors mb-1 border-t border-gray-200 mt-2 pt-3 ${
              selectedLayerId === backgroundLayer.id ? 'bg-teal-50 border-2 border-teal-500' : 'hover:bg-gray-50'
            }`}
          >
            {/* 占位符代替拖动手柄 */}
            <div className="p-1 flex-shrink-0 w-6" />

            {/* 可点击区域：缩略图 + 图层信息 */}
            <div 
              className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
              onClick={() => onLayerSelect?.(backgroundLayer.id)}
            >
              {/* 缩略图/类型图标 */}
              <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                <Palette className="w-5 h-5 text-purple-500" />
              </div>

              {/* 图层信息 */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${backgroundLayer.visible !== false ? 'text-gray-900' : 'text-gray-400'}`}>
                  {backgroundLayer.name}
                </p>
                <p className="text-xs text-gray-500">Background</p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {/* 显示/隐藏按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerVisibilityToggle?.(backgroundLayer.id);
                }}
                className={`p-1.5 rounded transition-colors ${
                  backgroundLayer.visible !== false ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-gray-200 text-gray-300'
                }`}
                title={backgroundLayer.visible !== false ? t.hideLayer : t.showLayer}
              >
                {backgroundLayer.visible !== false ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>

              {/* 锁定/解锁按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerLockToggle?.(backgroundLayer.id);
                }}
                className={`p-1.5 rounded transition-colors ${
                  backgroundLayer.locked ? 'hover:bg-gray-200 text-amber-500' : 'hover:bg-gray-200 text-gray-400'
                }`}
                title={backgroundLayer.locked ? t.unlockLayer : t.lockLayer}
              >
                {backgroundLayer.locked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
            </div>
          </>
        )}
      </div>
      {/* 收起/展开按钮 - 始终显示，位于左边缘 */}
      <button
        onClick={onToggleCollapse}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md flex items-center justify-center transition-colors border border-gray-200"
        title={isCollapsed ? t.expandLayers : t.collapseLayers}
      >
        {isCollapsed ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </div>
  );
}
